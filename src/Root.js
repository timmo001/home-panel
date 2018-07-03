import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createConnection, subscribeEntities } from 'home-assistant-js-websocket';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import { CircularProgress, Typography } from '@material-ui/core';
import Main from './Main';

const styles = theme => ({
  root: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    backgroundColor: theme.palette.mainBackground,
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

  componentWillMount = () => {
    this.connectToHASS();
  };

  stateChanged = (event) => {
    console.log('state changed', event);
  };

  eventHandler = (connection, data) => {
    console.log('Connection has been established again');
  };

  connectToHASS = () => {
    console.log(`Connect to wss://${process.env.REACT_APP_HASS_HOST}/api/websocket?latest`);
    if (process.env.REACT_APP_HASS_HOST) {
      createConnection(`wss://${process.env.REACT_APP_HASS_HOST}/api/websocket?latest`, { authToken: process.env.REACT_APP_HASS_PASSWORD })
        .then(conn => {
          this.setState({ connected: true });
          console.log(`Connected`);
          conn.removeEventListener('ready', this.eventHandler);
          conn.addEventListener('ready', this.eventHandler);
          subscribeEntities(conn, this.updateEntities);
        }, err => {
          console.error('Connection failed with code', err);
          this.setState({ snackMessage: { open: true, text: 'Connection failed' }, entities: undefined });
        });
    }
  }

  handleChange = (domain, state, data = undefined) => {
    createConnection(`wss://${process.env.REACT_APP_HASS_HOST}/api/websocket?latest`, { authToken: process.env.REACT_APP_HASS_PASSWORD })
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

  setTheme = (themeId = undefined) => {
    if (!themeId && themeId !== 0)
      themeId = Number(localStorage.getItem('theme'));
    if (!themeId && themeId !== 0)
      themeId = -1;
    if (themeId === -1) {
      // theme from sunlight
      const sun = this.state.entities.find(entity => {
        return entity[0] === 'sun.sun'
      });
      if (sun)
        this.props.setTheme(sun[1].state === 'below_horizon' ? 1 : 0);
      else
        this.props.setTheme(0);
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
    const { classes, theme } = this.props;
    const { snackMessage, entities, connected } = this.state;

    return (
      <div className={classes.root}>

        {entities ?
          <Main
            theme={theme}
            setTheme={this.setTheme}
            entities={entities}
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
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(Root);
