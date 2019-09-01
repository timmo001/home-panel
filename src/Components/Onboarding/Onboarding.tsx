// @flow
import React, { useEffect } from 'react';
import { Route, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import authentication from '@feathersjs/authentication-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import pink from '@material-ui/core/colors/pink';

import { ThemesProps } from '../Configuration/Config';
import clone from '../Utils/clone';
import Loading from '../Utils/Loading';
import Login from '../Login/Login';
import Main from '../Main/Main';
import parseTheme from '../Utils/parseTheme';

interface OnboardingProps extends RouteComponentProps {}

let socket: SocketIOClient.Socket, client: any;

function Onboarding(props: OnboardingProps) {
  const [loginAttempted, setLoginAttempted] = React.useState(false);
  const [loginCredentials, setLoggedIn] = React.useState();
  const [config, setConfig] = React.useState();
  const [configId, setConfigId] = React.useState();
  const [theme, setTheme] = React.useState(
    responsiveFontSizes(
      createMuiTheme({
        palette: {
          type: 'dark',
          primary: pink,
          secondary: pink,
          background: {
            default: '#303030',
            paper: '#383c45'
          }
        }
      })
    )
  );

  useEffect(() => {
    // TODO: Remove
    console.log('route props:', clone(props.location));
    console.log('window.location:', clone(window.location));
    console.log('window.location.pathname:', clone(window.location.pathname));

    if (!client) {
      client = feathers();
      let path: string = clone(window.location.pathname).replace(
        props.location.pathname,
        ''
      );
      // TODO: Remove
      console.log('path:', clone(path));
      let url: string = `${process.env.REACT_APP_API_PROTOCOL ||
        window.location.protocol}//${process.env.REACT_APP_API_HOSTNAME ||
        window.location.hostname}:${
        process.env.REACT_APP_API_PORT || process.env.NODE_ENV === 'development'
          ? '8234'
          : window.location.port
      }${path}`;
      // TODO: Remove
      console.log('url:', clone(url));
      socket = io(url);
      client.configure(socketio(socket));
      client.configure(authentication());
      client.path = `${path}/socket.io`;
      // TODO: Remove
      console.log('client.path:', clone(client.path));
    }

    if (!loginCredentials) handleLogin();
  });

  function handleSetTheme(palette: ThemesProps) {
    setTheme(
      responsiveFontSizes(createMuiTheme({ palette: parseTheme(palette) }))
    );
  }

  function handleCreateAccount(data: any, callback?: (error?: string) => void) {
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

  async function handleLogin(data?: any, callback?: (error?: string) => void) {
    try {
      process.env.NODE_ENV === 'development' &&
        console.log('login:', client.path, data);
      let something;
      if (!client) {
        console.warn('Feathers app is undefined');
      } else if (!data) something = await client.reAuthenticate();
      else something = await client.authenticate(data, callback);
      console.log(something.user);
      setLoggedIn(something.user);
      setLoginAttempted(true);
      getConfig(something.user._id);
    } catch (error) {
      console.error('Error in handleLogin:', error);
      setLoginAttempted(true);
      setLoggedIn(false);
      if (callback) callback(`Login error: ${error.message}`);
    }
  }

  function handleLogout() {
    localStorage.removeItem('hass_tokens');
    localStorage.removeItem('hass_url');
    client.logout().then(() => {
      props.history.push('/login');
    });
  }

  async function getConfig(userId: string) {
    const configService = await client.service('config');
    let getter = await configService.find({ userId });

    if (!getter.data[0]) {
      await configService.create({ createNew: true });
      getConfig(userId);
      return;
    }

    process.env.NODE_ENV === 'development' &&
      console.log('Config:', getter.data[0]);

    const configLcl = getter.data[0].config;
    setConfig(configLcl);
    setConfigId(getter.data[0]._id);

    if (configLcl.theme.themes && configLcl.theme.current) {
      let theme = configLcl.theme.themes.find(
        (theme: ThemesProps) => theme.key === configLcl.theme.current
      );
      if (theme) handleSetTheme(theme);
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
    <ThemeProvider theme={theme}>
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
              config={config}
              editing={0}
              loggedIn={loginCredentials ? true : false}
              loginCredentials={loginCredentials}
              handleConfigChange={handleConfigChange}
              handleLogout={handleLogout}
              handleSetTheme={handleSetTheme}
            />
          )}
        />
        <Redirect to="/overview" />
      </Switch>
    </ThemeProvider>
  );
}

export default Onboarding;
