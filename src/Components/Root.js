import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  getAuth, getUser, callService, createConnection,
  subscribeEntities, ERR_INVALID_AUTH
} from 'home-assistant-js-websocket';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import { CircularProgress, Typography } from '@material-ui/core';
import Login from './Login';
import Main from './Main';

const styles = theme => ({
  root: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    background: theme.palette.backgrounds.main,
  },
  center: {
    justifyContent: 'center',
    textAlign: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  progress: {
    marginBottom: theme.spacing.unit,
  },
});

var connection;

class Root extends Component {
  state = {
    snackMessage: { open: false, text: '' },
    finished: false,
  };

  loggedIn = (config, hass_url) => this.setState({ config, hass_url }, () => {
    this.connectToHASS();
    if (config.theme && config.theme.custom) {
      config.theme.custom.map(theme => this.props.addTheme(theme));
    }
  });

  eventHandler = (connection, data) => console.log('Connection has been established again');

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
      const conn = await createConnection({ setupRetry: 4, auth });
      // Clear url if we have been able to establish a connection
      if (this.props.location.search.includes('auth_callback=1')) {
        this.props.history.push({ search: '' })
      }
      return { auth, conn };
    } catch (err) {
      if (err !== ERR_INVALID_AUTH) {
        this.setState({
          snackMessage: { open: true, text: 'Connection to HASS failed. Please try again later' },
          entities: undefined,
          finished: true
        });
        localStorage.setItem('hass_failed', true);
        throw err;
      }
      // We can get invalid auth if auth tokens were stored that are no longer valid
      // Clear stored tokens.
      this.saveTokens(null);
      auth = await this.authProm();
      const conn = await createConnection({ auth });
      return { auth, conn };
    }
  };

  connectToHASS = () => {
    var hassFailed = localStorage.getItem('hass_failed');
    if (this.state.hass_url | hassFailed === true) {
      (async () => {
        connection = this.authProm().then(this.connProm);
        connection.then(({ conn }) => {
          this.setState({ finished: true });
          conn.removeEventListener('ready', this.eventHandler);
          conn.addEventListener('ready', this.eventHandler);
          subscribeEntities(conn, this.updateEntities);
          getUser(conn).then(user => {
            console.log('Logged into HASS as', user.name);
            sessionStorage.setItem('hass_id', user.id);
          });
          connection = conn;
        });
      })();
    } else {
      this.setState({
        snackMessage: { open: true, text: 'Connection to HASS failed. Please try to connect later' },
        entities: undefined,
        finished: true
      });
      localStorage.setItem('hass_failed', true);
      localStorage.setItem('hass_url', '');
      this.setTheme();
    }
    if (hassFailed === true) {
      localStorage.removeItem('hass_failed');
      localStorage.setItem('hass_url', '');
      this.setTheme();
    }
  }

  handleChange = (domain, state, data = undefined) => {
    if (typeof state === 'string') {
      callService(connection, domain, state, data).then(v => {
        this.setState({ snackMessage: { open: true, text: 'Changed.' } });
      }, err => {
        console.error('Error calling service:', err);
        this.setState({ snackMessage: { open: true, text: 'Error calling service' }, entities: undefined });
      });
    } else {
      callService(connection, domain, state ? 'turn_on' : 'turn_off', data).then(v => {
        this.setState({ snackMessage: { open: true, text: 'Changed.' } });
      }, err => {
        console.error('Error calling service:', err);
        this.setState({ snackMessage: { open: true, text: 'Error calling service' }, entities: undefined });
      });
    }
  };

  updateEntities = entities => {
    this.setState({ entities: Object.entries(entities) }, () => {
      this.setTheme();
    });
  };

  handleUpdateApiUrl = api_url => this.setState({ api_url });

  setTheme = (themeId = undefined) => {
    if (!themeId && themeId !== 0)
      themeId = Number(localStorage.getItem('theme'));
    if (!themeId && themeId !== 0)
      themeId = -1;
    if (themeId === -1) {
      if (this.state.config.theme.auto) {
        const state = this.state.entities.find(entity => {
          return entity[0] === this.state.config.theme.auto.sensor
        })[1].state;
        this.props.setTheme(state <= this.state.config.theme.auto.below ? 2 : 1);
      } else {
        // theme from sunlight
        const sun = this.state.entities.find(entity => {
          return entity[0] === 'sun.sun'
        });
        if (sun)
          this.props.setTheme(sun[1].state === 'below_horizon' ? 2 : 1);
        else
          this.props.setTheme(1);
      }
    } else
      this.props.setTheme(themeId);
    localStorage.setItem('theme', themeId);
  };

  handleClose = (event, reason) => {
    this.setState({ snackMessage: { open: false, text: '' } });
  };

  handlePageChange = (page) => {
    this.setState({ page }, () => {
      this.getEntities(this.state.entities, page);
    });
  };

  render() {
    const { loggedIn, setTheme, handleUpdateApiUrl } = this;
    const { classes, themes, theme } = this.props;
    const { config, snackMessage, entities, finished } = this.state;

    return (
      <div className={classes.root}>
        {!config ?
          <Login loggedIn={loggedIn} handleUpdateApiUrl={handleUpdateApiUrl} />
          :
          finished ?
            <Main
              themes={themes}
              theme={theme}
              setTheme={setTheme}
              config={config}
              entities={entities}
              apiUrl={this.state.api_url}
              handleChange={this.handleChange}
              saveTokens={this.saveTokens} />
            :
            <div className={classes.center}>
              <CircularProgress className={classes.progress} />
              {finished ?
                <Typography variant="subheading">
                  Loading Home Assistant data...
                </Typography>
                :
                <Typography variant="subheading">
                  Attempting to connect to Home Assistant...
                </Typography>
              }
            </div>
        }
        <Snackbar
          open={snackMessage.open}
          autoHideDuration={2000}
          onClose={this.handleClose}
          onExited={this.handleExited}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{snackMessage.text}</span>} />

      </div>
    );
  }
}

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  addTheme: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
};

export default withStyles(styles)(Root);
