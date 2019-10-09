// @flow
import React, { useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import io from 'socket.io-client';
import authentication from '@feathersjs/authentication-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import {
  ThemeProps,
  defaultPalette,
  defaultTheme
} from './Configuration/Config';
import { CommandType } from './Utils/Command';
import clone from '../Utils/clone';
import Loading from './Utils/Loading';
import Login from './Login';
import Main from './Main';
import parseTheme from '../Utils/parseTheme';

import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';

interface OnboardingProps extends RouteComponentProps {}

let socket: SocketIOClient.Socket, client: any;

function Onboarding(props: OnboardingProps) {
  const [loginAttempted, setLoginAttempted] = React.useState(false);
  const [loginCredentials, setLoggedIn] = React.useState();
  const [config, setConfig] = React.useState();
  const [configId, setConfigId] = React.useState();
  const [command, setCommand] = React.useState();
  const [theme, setTheme] = React.useState(
    responsiveFontSizes(
      createMuiTheme({
        palette: defaultPalette
      })
    )
  );

  useEffect(() => {
    if (!client) {
      client = feathers();
      let path: string = clone(props.location.pathname);
      let url: string = `${process.env.REACT_APP_API_PROTOCOL ||
        window.location.protocol}//${process.env.REACT_APP_API_HOSTNAME ||
        window.location.hostname}:${
        process.env.REACT_APP_API_PORT || process.env.NODE_ENV === 'development'
          ? '8234'
          : window.location.port
      }`;
      socket = io(url, { path: `${path}/socket.io`.replace('//', '/') });
      client.configure(socketio(socket));
      client.configure(authentication());
      client.path = path;
    }
  }, [props.location]);

  function handleSetTheme(palette: ThemeProps) {
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

      if (configLcl.theme) handleSetTheme(configLcl.theme);
    })();
  }, []);

  function handleCommand(message: CommandType) {
    console.log('Command Received:', message);
    setCommand(message);
  }

  const handleLogin = useCallback(
    (data?: any, callback?: (error?: string) => void) => {
      (async () => {
        try {
          let clientData;
          if (!client) {
            console.warn('Feathers app is undefined');
          } else if (!data) clientData = await client.reAuthenticate();
          else clientData = await client.authenticate(data, callback);
          console.log(clientData.user);
          setLoggedIn(clientData.user);
          setLoginAttempted(true);
          getConfig(clientData.user._id);
          const controllerService = await client.service('controller');
          controllerService.on('created', handleCommand);
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
    socket.emit('create', 'users', data, (error: any) => {
      if (error) {
        console.error('Error creating account:', error);
        if (callback) callback(`Error creating account: ${error.message}`);
      } else {
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
      if (error) console.error('Error updating', configId, ':', error);
      else {
        setConfig(config);
        process.env.NODE_ENV === 'development' &&
          console.log('Updated config:', configId, config);
      }
    });
  }

  if (!loginAttempted)
    return <Loading text="Attempting Login. Please Wait.." />;

  const cssOverrides = `
    a {color: ${(config && config.theme && config.theme.link_color) ||
      defaultTheme.link_color};}
  `;

  return (
    <ThemeProvider theme={theme}>
      <style>{cssOverrides}</style>
      {loginCredentials ? (
        <Main
          {...props}
          config={config}
          command={command}
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
