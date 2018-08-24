import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createConnection, subscribeEntities } from 'home-assistant-js-websocket';
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
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
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

class Root extends Component {
  state = {
    snackMessage: { open: false, text: '' },
    connected: false,
  };

  loggedIn = (config) => this.setState({ config }, () => {
    this.connectToHASS();
    if (config.theme && config.theme.custom) {
      config.theme.custom.map(theme => this.props.addTheme(theme));
    }
  });

  stateChanged = (event) => {
    console.log('state changed', event);
  };

  eventHandler = (connection, data) => {
    console.log('Connection has been established again');
  };

  connectToHASS = () => {
    if (this.state.config && this.state.config.hass_host) {
      const wsURL = `${this.state.config.hass_ssl ? 'wss' : 'ws'}://` +
        `${this.state.config.hass_host}/api/websocket?latest`;
      console.log(`Connect to ${wsURL}`);
      createConnection(wsURL, { authToken: this.state.config.hass_password })
        .then(conn => {
          this.setState({ connected: true });
          console.log(`Connected`);
          conn.removeEventListener('ready', this.eventHandler);
          conn.addEventListener('ready', this.eventHandler);
          subscribeEntities(conn, this.updateEntities);
        }, err => {
          console.error('Connection failed with code', err);
          // localStorage.removeItem('username');
          sessionStorage.removeItem('password');
          this.setState({
            snackMessage: { open: true, text: 'Connection failed' },
            entities: undefined,
            config: undefined
          });
        });
    }
  }

  handleChange = (domain, state, data = undefined) => {
    console.log('Change:', domain, state, data);
    const wsURL = `${this.state.config.hass_ssl ? 'wss' : 'ws'}://` +
      `${this.state.config.hass_host}/api/websocket?latest`;
    console.log(`Connect to ${wsURL}`);
    createConnection(wsURL, { authToken: this.state.config.hass_password })
      .then(conn => {
        conn.callService(domain, state ? 'turn_on' : 'turn_off', data).then(v => {
          this.setState({ snackMessage: { open: true, text: 'Changed.' } });
          setTimeout(() => this.connectToHASS(), 2000);
        });
      }, err => {
        console.error('Connection failed with code', err);
        this.setState({ snackMessage: { open: true, text: 'Connection failed' }, entities: undefined });
      });
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
    // if (reason === 'clickaway') return;
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
    const { config, snackMessage, entities, connected } = this.state;

    return (
      <div className={classes.root}>
        {!config ?
          <Login loggedIn={loggedIn} handleUpdateApiUrl={handleUpdateApiUrl} />
          :
          entities ?
            <Main
              themes={themes}
              theme={theme}
              setTheme={setTheme}
              config={config}
              entities={entities}
              apiUrl={this.state.api_url}
              handleChange={this.handleChange} />
            :
            <div className={classes.center}>
              <CircularProgress className={classes.progress} />
              {connected ?
                <Typography variant="subheading">
                  Loading HASS data...
              </Typography>
                :
                <Typography variant="subheading">
                  Attempting to connect to HASS...
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
