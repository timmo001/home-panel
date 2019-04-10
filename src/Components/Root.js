import React from 'react';
import PropTypes from 'prop-types';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import auth from '@feathersjs/authentication-client';
import {
  getAuth,
  getUser,
  callService,
  createConnection,
  subscribeConfig,
  subscribeEntities,
  ERR_INVALID_AUTH
} from 'home-assistant-js-websocket';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { CircularProgress, Typography } from '@material-ui/core';
import Login from './Login';
import Main from './Main';
import defaultConfig from './EditConfig/defaultConfig.json';

const styles = theme => ({
  root: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    background: theme.palette.backgrounds.main
  },
  center: {
    justifyContent: 'center',
    textAlign: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)'
  },
  progress: {
    marginBottom: theme.spacing.unit
  },
  progressRoot: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
});

const app = feathers();
const socket = io(
  `${process.env.REACT_APP_API_PROTOCOL || window.location.protocol}//${process
    .env.REACT_APP_API_HOSTNAME || window.location.hostname}:${process.env
    .REACT_APP_API_PORT || 3234}`
);

// Setup the transport (Rest, Socket, etc.) here
app.configure(socketio(socket));

// Available options are listed in the "Options" section
app.configure(auth({ storage: localStorage }));

let connection;

class Root extends React.PureComponent {
  state = {
    snackMessage: { open: false, text: '' },
    connected: false,
    hass_url:
      localStorage.getItem('hass_url') ||
      `${window.location.protocol}//hassio:8123`
  };

  componentDidMount = () => this.login();

  setHassUrl = hass_url => this.setState({ hass_url });

  createAccount = data => {
    process.env.NODE_ENV === 'development' && console.log('account:', data);
    socket.emit('create', 'users', data, error => {
      if (error)
        process.env.NODE_ENV === 'development' &&
          console.error('Error creating account:', error);
      else {
        process.env.NODE_ENV === 'development' &&
          console.log('Created new account.');
        this.login({ strategy: 'local', ...data });
      }
    });
    setTimeout(() => this.setState({ loginAttempted: true }), 500);
  };

  logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('hass_tokens');
    app.logout().then(() =>
      this.setState({
        loggedIn: false,
        loginError: undefined,
        config: undefined
      })
    );
  };

  login = (data = undefined) => {
    process.env.NODE_ENV === 'development' && console.log('login:', data);
    if (!data)
      app.passport.getJWT().then(accessToken => {
        accessToken &&
          this.authenticate({
            strategy: 'jwt',
            accessToken
          });
      });
    else this.authenticate(data);
    setTimeout(() => this.setState({ loginAttempted: true }), 500);
  };

  authenticate = data =>
    app
      .authenticate(data)
      .then(response => {
        process.env.NODE_ENV === 'development' &&
          console.log('Authenticated:', response);
        return app.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        process.env.NODE_ENV === 'development' &&
          console.log('JWT Payload:', payload);
        return app.service('users').get(payload.userId);
      })
      .then(user => {
        app.set('user', user);
        process.env.NODE_ENV === 'development' &&
          console.log('User:', app.get('user'));
        this.setState({
          loggedIn: true,
          loginError: undefined,
          userId: app.get('user')._id
        });
        this.loggedIn();
        this.getConfig();
      })
      .catch(e => {
        console.error('Authentication error:', e);
        this.setState({ loggedIn: false, loginError: e.message });
      });

  getConfig = async () => {
    const configService = await app.service('config');
    let getter = await configService.find();

    process.env.NODE_ENV === 'development' &&
      console.log('server config:', getter.data[0]);

    if (!getter.data[0]) {
      try {
        await configService.create({ createNew: true });
        this.getConfig();
      } catch (e) {
        console.error(e.message);
        this.setState({ loginError: e.message });
      }
      return;
    }

    process.env.NODE_ENV === 'development' &&
      console.log('getter.data[0]:', getter.data[0]);

    const config = { ...defaultConfig, ...getter.data[0].config };

    process.env.NODE_ENV === 'development' &&
      console.log('local config:', config);

    this.setState({ configId: getter.data[0]._id, config }, () => {
      if (config.theme && config.theme.custom)
        config.theme.custom.map(theme => this.props.addTheme(theme));
    });

    this.setTheme();

    configService.on('patched', () => this.getConfig());
  };

  loggedIn = () => {
    if (this.state.hass_url) {
      if (this.loadTokens()) this.connectToHASS();
      else if (this.props.location.search.includes('auth_callback=1'))
        this.connectToHASS();
      else this.askAuth();
    } else
      this.setState({
        entities: [],
        snackMessage: {
          open: true,
          text:
            'No Home Assistant URL provided. Please re-login to enable HASS features.'
        }
      });
  };

  eventHandler = () => console.log('Connection has been established again');

  loadTokens = () => {
    let hassTokens;
    try {
      hassTokens = JSON.parse(localStorage.getItem('hass_tokens'));
    } catch (err) {} // eslint-disable-line
    process.env.NODE_ENV === 'development' &&
      console.log('loadTokens:', hassTokens);
    return hassTokens;
  };

  saveTokens = tokens => {
    try {
      localStorage.setItem('hass_tokens', JSON.stringify(tokens));
    } catch (err) {} // eslint-disable-line
  };

  authProm = () =>
    getAuth({
      hassUrl: this.state.hass_url,
      saveTokens: this.saveTokens,
      loadTokens: () => Promise.resolve(this.loadTokens())
    });

  connProm = async auth => {
    try {
      const conn = await createConnection({ auth });
      // Clear url if we have been able to establish a connection
      if (this.props.location.search.includes('auth_callback=1'))
        this.props.history.push({ search: '' });
      return { auth, conn };
    } catch (err) {
      try {
        if (err !== ERR_INVALID_AUTH) {
          throw err;
        }
        // We can get invalid auth if auth tokens were stored that are no longer valid
        // Clear stored tokens.
        this.saveTokens(null);
        auth = await this.authProm();
        const conn = await createConnection({ auth });
        return { auth, conn };
      } catch (err) {
        this.setState({
          snackMessage: {
            open: true,
            text: 'Connection to Home Assistant failed. Please try again later.'
          },
          entities: []
        });
        throw err;
      }
    }
  };

  connectToHASS = () => {
    process.env.NODE_ENV === 'development' && console.log('connectToHASS');
    (async () => {
      localStorage.setItem('auth_triggered', true);
      connection = this.authProm().then(this.connProm);
      connection.then(({ conn }) => {
        localStorage.removeItem('auth_triggered');
        this.setState({ connected: true });
        conn.removeEventListener('ready', this.eventHandler);
        conn.addEventListener('ready', this.eventHandler);
        subscribeConfig(conn, this.updateConfig);
        subscribeEntities(conn, this.updateEntities);
        getUser(conn).then(user => {
          console.log('Logged into Home Assistant as', user.name);
          sessionStorage.setItem('hass_id', user.id);
        });
        connection = conn;
      });
    })();
  };

  askAuth = () =>
    this.setState({
      entities: [],
      snackMessage: {
        open: true,
        text: 'Please login to Home Assistant',
        persistent: true,
        actions: (
          <div>
            <Button
              color="primary"
              size="small"
              onClick={() => this.handleAuthAction(0)}>
              No Thanks
            </Button>
            <Button
              color="primary"
              size="small"
              onClick={() => this.handleAuthAction(1)}>
              Login
            </Button>
          </div>
        )
      }
    });

  handleAuthAction = action => {
    switch (action) {
      default:
        break;
      case 1:
        this.connectToHASS();
        break;
    }
    this.handleSnackbarClose();
  };

  handleChange = (domain, state, data = undefined) => {
    process.env.NODE_ENV === 'development' &&
      console.log('handleChange:', domain, state, data);
    if (typeof state === 'string') {
      callService(connection, domain, state, data).then(
        () => {
          this.setState({ snackMessage: { open: true, text: 'Changed.' } });
        },
        err => {
          console.error('Error calling service:', err);
          this.setState({
            snackMessage: { open: true, text: 'Error calling service' },
            entities: undefined
          });
        }
      );
    } else {
      callService(
        connection,
        domain,
        state ? 'turn_on' : 'turn_off',
        data
      ).then(
        () => {
          this.setState({ snackMessage: { open: true, text: 'Changed.' } });
        },
        err => {
          console.error('Error calling service:', err);
          this.setState({
            snackMessage: { open: true, text: 'Error calling service' },
            entities: undefined
          });
        }
      );
    }
  };

  updateConfig = config => this.setState({ haConfig: config });

  updateEntities = entities =>
    this.setState({ entities: Object.entries(entities) });

  setTheme = (themeId = undefined) => {
    process.env.NODE_ENV === 'development' && console.log('setTheme:', themeId);
    const { config } = this.state;
    const lightThemeName =
      config.theme.auto && config.theme.auto.light_theme
        ? config.theme.auto.light_theme
        : 'light';
    const darkThemeName =
      config.theme.auto && config.theme.auto.dark_theme
        ? config.theme.auto.dark_theme
        : 'dark';

    const lightTheme = this.props.themes.find(
      t => t.name.toLowerCase() === lightThemeName.toLowerCase()
    );
    const darkTheme = this.props.themes.find(
      t => t.name.toLowerCase() === darkThemeName.toLowerCase()
    );

    if (!themeId && themeId !== 0)
      themeId = Number(localStorage.getItem('theme'));
    if (!themeId && themeId !== 0) themeId = -1;
    if (themeId === -1) {
      if (
        config.theme.auto &&
        this.state.entities &&
        config.theme.auto.sensor
      ) {
        const sensor = this.state.entities.find(
          entity => entity[0] === config.theme.auto.sensor
        );
        if (sensor)
          this.props.setTheme(
            sensor[1].state <= config.theme.auto.below ? darkTheme : lightTheme
          );
      } else {
        // theme from sunlight
        console.log('Revert to sunlight sensor');
        const sun = this.state.entities.find(entity => entity[0] === 'sun.sun');
        if (sun)
          this.props.setTheme(
            sun[1].state === 'below_horizon' ? darkTheme : lightTheme
          );
        else this.props.setTheme(lightTheme);
      }
    } else this.props.setTheme(this.props.themes.find(t => t.id === themeId));
    localStorage.setItem('theme', themeId);
  };

  handleSnackbarClose = () =>
    this.setState({ snackMessage: { open: false, text: '' } });

  handlePageChange = page => {
    this.setState({ page }, () => {
      this.getEntities(this.state.entities, page);
    });
  };

  handleConfigChange = config => {
    // config = cleanupObject(config);
    socket.emit(
      'patch',
      'config',
      this.state.configId,
      { config },
      (error, note) => {
        if (error)
          process.env.NODE_ENV === 'development' &&
            console.error('Error updating', this.state.configId, ':', error);
        else
          process.env.NODE_ENV === 'development' &&
            console.log('Updated config:', this.state.configId, note);
      }
    );
  };

  render() {
    const { setTheme } = this;
    const { classes, themes, theme } = this.props;
    const {
      config,
      snackMessage,
      hass_url,
      haConfig,
      entities,
      connected,
      loginError
    } = this.state;

    return (
      <div className={classes.root}>
        {!config ? (
          <Login
            error={loginError}
            setHassUrl={this.setHassUrl}
            handleCreateAccount={this.createAccount}
            handleLogin={this.login}
          />
        ) : entities ? (
          <Main
            themes={themes}
            theme={theme}
            setTheme={setTheme}
            config={config}
            haUrl={hass_url}
            haConfig={haConfig}
            entities={entities}
            logout={this.logout}
            handleConfigChange={this.handleConfigChange}
            handleChange={this.handleChange}
            saveTokens={this.saveTokens}
          />
        ) : (
          <div className={classes.center}>
            <CircularProgress className={classes.progress} />
            {connected ? (
              <Typography variant="subtitle1">
                Loading Home Assistant data..
              </Typography>
            ) : (
              <Typography variant="subtitle1">
                Attempting to connect to Home Assistant..
              </Typography>
            )}
          </div>
        )}
        <Snackbar
          open={snackMessage.open}
          autoHideDuration={!snackMessage.persistent ? 4000 : null}
          onClose={!snackMessage.persistent ? this.handleSnackbarClose : null}
          onExited={this.handleExited}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{snackMessage.text}</span>}
          action={snackMessage.actions}
        />
      </div>
    );
  }
}

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  addTheme: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired
};

export default withStyles(styles)(Root);
