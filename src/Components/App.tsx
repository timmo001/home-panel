// @flow
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import io from 'socket.io-client';
import auth, {
  FeathersAuthCredentials
} from '@feathersjs/authentication-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';

import Loading from './Utils/Loading';
import Main from './Main/Main';
import Login from './Login/Login';

import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';

let theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: pink,
    secondary: purple,
    background: {
      default: '#303030',
      paper: '#383c45'
    }
  }
});
theme = responsiveFontSizes(theme);

const app = feathers();
const socket = io(
  `${process.env.REACT_APP_API_PROTOCOL || window.location.protocol}//${process
    .env.REACT_APP_API_HOSTNAME || window.location.hostname}:${process.env
    .REACT_APP_API_PORT || 8234}`
);
app.configure(socketio(socket));
app.configure(auth({ storage: localStorage }));

function App() {
  useEffect(() => {
    if (!loginCredentials) handleLogin();
  });

  const [loginAttempted, setLoginAttempted] = React.useState(false);
  const [loginCredentials, setLoginCredentials] = React.useState();
  const [config, setConfig] = React.useState();
  const [configId, setConfigId] = React.useState();

  function handleCreateAccount(
    data: FeathersAuthCredentials,
    callback?: (error?: string) => void
  ) {
    process.env.NODE_ENV === 'development' && console.log('account:', data);
    socket.emit('create', 'users', data, (error: any) => {
      if (error) {
        process.env.NODE_ENV === 'development' &&
          console.error('Error creating account:', error);
        if (callback) callback(`Error creating account: ${error.message}`);
      } else {
        process.env.NODE_ENV === 'development' &&
          console.log('Created new account.');
        handleLogin({ strategy: 'local', ...data }, callback);
      }
    });
  }

  function handleLogin(
    data?: FeathersAuthCredentials,
    callback?: (error?: string) => void
  ) {
    process.env.NODE_ENV === 'development' && console.log('login:', data);
    if (!data)
      app.passport
        .getJWT()
        .then(accessToken => {
          accessToken
            ? authenticate(
                {
                  strategy: 'jwt',
                  accessToken
                },
                callback
              )
            : setLoginAttempted(true);
        })
        .catch(() => setLoginAttempted(true));
    else authenticate(data, callback);
  }

  function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('hass_tokens');
    localStorage.removeItem('hass_url');
    app.logout().then(() => {
      window.location.reload(true);
    });
  }

  function authenticate(
    data: FeathersAuthCredentials,
    callback?: (error?: string) => void
  ) {
    process.env.NODE_ENV === 'development' &&
      console.log('authenticate:', data);
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
        process.env.NODE_ENV === 'development' && console.log('User:', user);
        setLoginCredentials(user);
        setLoginAttempted(true);
        if (callback) callback();
        getConfig();
      })
      .catch(e => {
        console.error('Authentication error:', e);
        if (callback) callback(`Authentication error: ${e.message}`);
        setLoginAttempted(true);
      });
  }

  async function getConfig() {
    const configService = await app.service('config');
    let getter = await configService.find();

    process.env.NODE_ENV === 'development' &&
      console.log('server config:', getter.data[0]);

    if (!getter.data[0]) {
      try {
        await configService.create({ createNew: true });
      } catch (e) {
        console.error(e.message);
      }
      getConfig();
      return;
    }

    process.env.NODE_ENV === 'development' &&
      console.log('getter.data[0]:', getter.data[0]);

    setConfig(getter.data[0].config);
    setConfigId(getter.data[0]._id);
  }

  function handleConfigChange(config: any) {
    socket.emit('patch', 'config', configId, { config }, (error: any) => {
      if (error)
        process.env.NODE_ENV === 'development' &&
          console.error('Error updating', configId, ':', error);
      else {
        setConfig(config);
        process.env.NODE_ENV === 'development' &&
          console.log('Updated config:', configId, config);
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
      {!loginAttempted ? (
        <Loading text="Please Wait.." />
      ) : (
        <Router>
          <Switch>
            <Route
              path="/login"
              render={props => (
                <Login
                  {...props}
                  loggedIn={loginCredentials ? true : false}
                  handleCreateAccount={handleCreateAccount}
                  handleLogin={handleLogin}
                />
              )}
              exact
            />
            <Route
              path="/"
              render={props => (
                <Main
                  {...props}
                  loggedIn={loginCredentials ? true : false}
                  loginCredentials={loginCredentials}
                  config={config}
                  handleConfigChange={handleConfigChange}
                  handleLogout={handleLogout}
                />
              )}
            />
          </Switch>
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;
