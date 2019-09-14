// @flow
import React, { useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import io from 'socket.io-client';
import authentication from '@feathersjs/authentication-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import pink from '@material-ui/core/colors/pink';

import { ThemesProps } from './Configuration/Config';
import clone from './Utils/clone';
import Loading from './Utils/Loading';
import Login from './Login';
import Main from './Main';
import parseTheme from './Utils/parseTheme';

import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';

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
    console.log('ONBOARDING - route location:', clone(props.location));
    console.log('ONBOARDING - window location:', clone(window.location));

    if (!client) {
      client = feathers();
      let path: string = clone(props.location.pathname);
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
      socket = io(url, { path: `${path}/socket.io`.replace('//', '/') });
      client.configure(socketio(socket));
      client.configure(authentication());
      client.path = path;
      // TODO: Remove
      console.log('client.path:', clone(client.path));
    }
  }, [props.location]);

  function handleSetTheme(palette: ThemesProps) {
    setTheme(
      responsiveFontSizes(createMuiTheme({ palette: parseTheme(palette) }))
    );
  }

  const getConfig = useCallback((userId: string) => {
    (async () => {
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
    })();
  }, []);

  const handleLogin = useCallback(
    (data?: any, callback?: (error?: string) => void) => {
      // TODO: process.env.NODE_ENV === 'development' &&
      console.log('handleLogin:', client, clone(data));
      let surl = prompt('socket url?');
      if (surl) {
        socket = io(surl, { path: `${path}/socket.io`.replace('//', '/') });
        client.configure(socketio(socket));
        client.configure(authentication());
      }
      let spath = prompt('socket path?');
      if (spath && typeof spath === 'string') {
        socket = io(String(surl), { path: spath });
        client.configure(socketio(socket));
        client.configure(authentication());
      }
      let path = prompt('path?', client.path);
      if (path) client.path = path;
      (async () => {
        try {
          // TODO: process.env.NODE_ENV === 'development' &&
          console.log('handleLogin:', client, clone(data));
          let clientData;
          if (!client) {
            console.warn('Feathers app is undefined');
          } else if (!data) clientData = await client.reAuthenticate();
          else clientData = await client.authenticate(data, callback);
          console.log(clientData.user);
          setLoggedIn(clientData.user);
          setLoginAttempted(true);
          getConfig(clientData.user._id);
        } catch (error) {
          console.error('Error in handleLogin:', error);
          setLoginAttempted(true);
          setLoggedIn(undefined);
          if (callback) callback(`Login error: ${error.message}`);
        }
      })();
    },
    [getConfig]
  );

  useEffect(() => {
    if (!loginCredentials) handleLogin();
  }, [loginCredentials, handleLogin]);

  function handleCreateAccount(data: any, callback?: (error?: string) => void) {
    // TODO: process.env.NODE_ENV === 'development' &&
    console.log('handleCreateAccount:', clone(client.path), clone(data));
    socket.emit('create', 'users', data, (error: any) => {
      if (error) {
        // TODO: process.env.NODE_ENV === 'development' &&
        console.error('Error creating account:', error);
        if (callback) callback(`Error creating account: ${error.message}`);
      } else {
        // TODO: process.env.NODE_ENV === 'development' &&
        console.log('Created new account.');
        handleLogin({ strategy: 'local', ...data }, callback);
      }
    });
  }

  async function handleLogout() {
    localStorage.removeItem('hass_tokens');
    localStorage.removeItem('hass_url');
    await client.logout();
    window.location.replace(window.location.href);
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
      {loginCredentials ? (
        <Main
          {...props}
          config={config}
          editing={0}
          loginCredentials={loginCredentials}
          handleConfigChange={handleConfigChange}
          handleLogout={handleLogout}
          handleSetTheme={handleSetTheme}
        />
      ) : (
        <Login
          {...props}
          handleCreateAccount={handleCreateAccount}
          handleLogin={handleLogin}
        />
      )}
    </ThemeProvider>
  );
}

export default Onboarding;
