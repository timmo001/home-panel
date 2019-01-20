import React from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import {
  getAuth, getUser, callService, createConnection,
  subscribeConfig, subscribeEntities, ERR_INVALID_AUTH
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

var connection;

class Root extends React.Component {
  state = {
    snackMessage: { open: false, text: '' },
    connected: false
  };

  loggedIn = (config, username, password, api_url, hass_url) => {
    localStorage.setItem('should_login', true);
    config = { ...defaultConfig, ...config };
    this.setState({ config, username, password, api_url, hass_url }, () => {
      if (this.state.hass_url) {
        if (this.loadTokens()) this.connectToHASS();
        else if (localStorage.getItem('should_auth')) {
          if (localStorage.getItem('auth_triggered'))
            this.connectToHASS();
          else this.askAuth();
        }
      } else this.setState({
        entities: [], snackMessage: {
          open: true, text: 'No Home Assistant URL provided. Please re-login to enable HASS features.'
        }
      })
      if (config.theme && config.theme.custom) config.theme.custom.map(theme => this.props.addTheme(theme));
    });
  };

  eventHandler = () => console.log('Connection has been established again');

  loadTokens = () => {
    let hassTokens;
    try {
      hassTokens = JSON.parse(localStorage.getItem('hass_tokens'));
    } catch (err) { }  // eslint-disable-line
    return hassTokens;
  };

  saveTokens = (tokens) => {
    try {
      localStorage.setItem('hass_tokens', JSON.stringify(tokens));
    } catch (err) { }  // eslint-disable-line
  };

  authProm = () => getAuth({
    hassUrl: this.state.hass_url,
    saveTokens: this.saveTokens,
    loadTokens: () => Promise.resolve(this.loadTokens()),
  });

  connProm = async (auth) => {
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
          snackMessage: { open: true, text: 'Connection to Home Assistant failed. Please try again later.' },
          entities: []
        });
        throw err;
      }
    }
  };

  connectToHASS = () => {
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
  }

  askAuth = () => this.setState({
    entities: [],
    snackMessage: {
      open: true,
      text: 'Please login to Home Assistant',
      persistent: true,
      actions:
        <div>
          <Button color="primary" size="small" onClick={() => this.handleAuthAction(0)}>
            No Thanks
          </Button>
          <Button color="primary" size="small" onClick={() => this.handleAuthAction(1)}>
            Login
          </Button>
        </div>
    }
  });

  handleAuthAction = action => {
    switch (action) {
      default: break;
      case 1:
        this.connectToHASS();
        break;
    }
    this.handleSnackbarClose();
  };

  handleChange = (domain, state, data = undefined) => {
    if (typeof state === 'string') {
      callService(connection, domain, state, data).then(() => {
        this.setState({ snackMessage: { open: true, text: 'Changed.' } });
      }, err => {
        console.error('Error calling service:', err);
        this.setState({ snackMessage: { open: true, text: 'Error calling service' }, entities: undefined });
      });
    } else {
      callService(connection, domain, state ? 'turn_on' : 'turn_off', data).then(() => {
        this.setState({ snackMessage: { open: true, text: 'Changed.' } });
      }, err => {
        console.error('Error calling service:', err);
        this.setState({ snackMessage: { open: true, text: 'Error calling service' }, entities: undefined });
      });
    }
  };

  updateConfig = config => this.setState({ haConfig: config });

  updateEntities = entities => this.setState({ entities: Object.entries(entities) });

  setTheme = (themeId = undefined) => {
    const lightThemeName = this.state.config.theme.auto && this.state.config.theme.auto.light_theme ?
      this.state.config.theme.auto.light_theme : 'light';
    const darkThemeName = this.state.config.theme.auto && this.state.config.theme.auto.dark_theme ?
      this.state.config.theme.auto.dark_theme : 'dark';

    const lightTheme = this.props.themes.find(t => t.name.toLowerCase() === lightThemeName.toLowerCase());
    const darkTheme = this.props.themes.find(t => t.name.toLowerCase() === darkThemeName.toLowerCase());

    if (!themeId && themeId !== 0)
      themeId = Number(localStorage.getItem('theme'));
    if (!themeId && themeId !== 0)
      themeId = -1;
    if (themeId === -1) {
      if (this.state.config.theme.auto && this.state.entities && this.state.config.theme.auto.sensor) {
        const state = this.state.entities.find(entity => entity[0] === this.state.config.theme.auto.sensor)[1].state;
        this.props.setTheme(state <= this.state.config.theme.auto.below ? darkTheme : lightTheme);
      } else {
        // theme from sunlight
        console.log('Revert to sunlight sensor');
        const sun = this.state.entities.find(entity => entity[0] === 'sun.sun');
        if (sun) this.props.setTheme(sun[1].state === 'below_horizon' ? darkTheme : lightTheme);
        else this.props.setTheme(lightTheme);
      }
    } else
      this.props.setTheme(this.props.themes.find(t => t.id === themeId));
    localStorage.setItem('theme', themeId);
  };

  handleSnackbarClose = () => this.setState({ snackMessage: { open: false, text: '' } });

  handlePageChange = (page) => {
    this.setState({ page }, () => {
      this.getEntities(this.state.entities, page);
    });
  };

  handleConfigChange = config => {
    request
      .post(`${this.state.api_url}/config/set`)
      .send({
        username: this.state.username,
        password: this.state.password,
        config
      })
      .retry(2)
      .timeout({
        response: 5000,
        deadline: 30000,
      })
      .then(res => {
        if (res.status === 200) {
          this.setState(config, () => this.setTheme());
        } else {
          console.log('An error occurred: ', res.status);
        }
      })
      .catch(err => {
        console.log('An error occurred: ', err);
      });
  };

  render() {
    const { loggedIn, setTheme } = this;
    const { classes, themes, theme } = this.props;
    const { config, snackMessage, hass_url, haConfig, entities, connected } = this.state;

    return (
      <div className={classes.root}>
        {!config ?
          <Login loggedIn={loggedIn} />
          :
          entities ?
            <Main
              themes={themes}
              theme={theme}
              setTheme={setTheme}
              config={config}
              haUrl={hass_url}
              haConfig={haConfig}
              entities={entities}
              username={this.state.username}
              password={this.state.password}
              apiUrl={this.state.api_url}
              handleConfigChange={this.handleConfigChange}
              handleChange={this.handleChange}
              saveTokens={this.saveTokens} />
            :
            <div className={classes.center}>
              <CircularProgress className={classes.progress} />
              {connected ?
                <Typography variant="subtitle1">
                  Loading Home Assistant data..
                  </Typography>
                :
                <Typography variant="subtitle1">
                  Attempting to connect to Home Assistant..
                  </Typography>
              }
            </div>
        }
        <Snackbar
          open={snackMessage.open}
          autoHideDuration={!snackMessage.persistent ? 4000 : null}
          onClose={!snackMessage.persistent ? this.handleSnackbarClose : null}
          onExited={this.handleExited}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{snackMessage.text}</span>}
          action={snackMessage.actions} />

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
