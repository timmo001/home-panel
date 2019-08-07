// @flow
import React, { useEffect } from 'react';
import { Route, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import auth, {
  FeathersAuthCredentials
} from '@feathersjs/authentication-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';

import Loading from '../Utils/Loading';
import Main from '../Main/Main';
import Login from '../Login/Login';

interface OnboardingProps extends RouteComponentProps {}

let socket: SocketIOClient.Socket, app: any;

app = feathers();
let url: string = `${process.env.REACT_APP_API_PROTOCOL ||
  window.location.protocol}//${process.env.REACT_APP_API_HOSTNAME ||
  window.location.hostname}:${
  process.env.REACT_APP_API_PORT || process.env.NODE_ENV === 'development'
    ? '8234'
    : window.location.port
}`;
socket = io(url);
app.configure(socketio(socket));
app.configure(auth({ storage: localStorage }));

function Onboarding(props: OnboardingProps) {
  useEffect(() => {
    process.env.NODE_ENV === 'development' &&
      console.log('route props:', props);

    app.path = `${props.location.pathname.replace(
      /overview|login|configuration/gi,
      ''
    )}socket.io`;

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
    process.env.NODE_ENV === 'development' &&
      console.log('login:', app.path, data);
    if (!app) {
      console.warn('Feathers app is undefined');
    } else if (!data)
      app.passport
        .getJWT()
        .then((accessToken: string) => {
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
      props.history.replace('/login');
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
      .then((response: { accessToken: any }) => {
        process.env.NODE_ENV === 'development' &&
          console.log('Authenticated:', response);
        return app.passport.verifyJWT(response.accessToken);
      })
      .then((payload: { userId: any }) => {
        process.env.NODE_ENV === 'development' &&
          console.log('JWT Payload:', payload);
        return app.service('users').get(payload.userId);
      })
      .then((user: any) => {
        app.set('user', user);
        process.env.NODE_ENV === 'development' && console.log('User:', user);
        setLoginCredentials(user);
        setLoginAttempted(true);
        if (callback) callback();
      })
      .then(getConfig)
      .catch((e: { message: any }) => {
        console.error('Authentication error:', e);
        if (callback) callback(`Authentication error: ${e.message}`);
        setLoginAttempted(true);
      });
  }

  async function getConfig() {
    try {
      const configService = await app.service('config');
      let getter = await configService.find();

      process.env.NODE_ENV === 'development' &&
        console.log('server config:', getter.data[0]);

      if (!getter.data[0]) {
        await configService.create({ createNew: true });
        getConfig();
        return;
      }

      process.env.NODE_ENV === 'development' &&
        console.log('getter.data[0]:', getter.data[0]);

      setConfig(getter.data[0].config);
      setConfigId(getter.data[0]._id);
    } catch (e) {
      console.error(e.message);
    }
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

  if (!loginAttempted)
    return <Loading text="Attempting Login. Please Wait.." />;

  return (
    <Switch>
      <Route
        exact
        path="/login"
        render={(props: RouteComponentProps) => (
          <Login
            {...props}
            loggedIn={loginCredentials ? true : false}
            handleCreateAccount={handleCreateAccount}
            handleLogin={handleLogin}
          />
        )}
      />
      <Route
        exact
        path="/(overview|configuration)/"
        render={(props: RouteComponentProps) => (
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
      <Redirect to="/overview" />
    </Switch>
  );
}

export default Onboarding;
