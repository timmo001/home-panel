import React, { useEffect, useCallback, ReactElement, useState } from "react";
import { AuthenticationResult } from "@feathersjs/authentication/lib";
import authentication from "@feathersjs/authentication-client";
import feathers from "@feathersjs/feathers";
import io from "socket.io-client";
import socketio from "@feathersjs/socketio-client";
import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
} from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import {
  ThemeProps,
  defaultPalette,
  defaultTheme,
  ConfigurationProps,
} from "./Configuration/Config";
import { CommandType } from "./Utils/Command";
import { Page, ProgressState } from "./Types/Types";
import clone from "../utils/clone";
import Loading from "./Utils/Loading";
import Login, { Auth } from "./Login";
import Main from "./Main";
import parseTheme from "../utils/parseTheme";

let moveTimeout: NodeJS.Timeout;
let socket: SocketIOClient.Socket, client: feathers.Application;
function Onboarding(): ReactElement {
  const [loginAttempt, setLoginAttempt] = useState<ProgressState>(-2);
  const [loginCredentials, setLoginCredentials] =
    useState<AuthenticationResult>();
  const [config, setConfig] = useState<ConfigurationProps>();
  const [configId, setConfigId] = useState<string>();
  const [command, setCommand] = useState<CommandType>();
  const [mouseMoved, setMouseMoved] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(
    responsiveFontSizes(
      createMuiTheme({
        palette: defaultPalette,
      })
    )
  );
  const [currentPage, setCurrentPage] = useState<Page>("Overview");

  useEffect(() => {
    if (!client) {
      client = feathers();
      const path: string = clone(window.location.pathname);
      const url = `${
        process.env.REACT_APP_API_PROTOCOL || window.location.protocol
      }//${process.env.REACT_APP_API_HOSTNAME || window.location.hostname}:${
        process.env.REACT_APP_API_PORT || process.env.NODE_ENV === "development"
          ? "8234"
          : window.location.port
      }`;
      socket = io(url, { path: `${path}/socket.io`.replace("//", "/") });
      client.configure(socketio(socket));
      client.configure(authentication());
    }
  }, []);

  function handleSetTheme(palette: ThemeProps): void {
    setTheme(
      responsiveFontSizes(
        createMuiTheme({
          palette: parseTheme(palette),
          overrides: {
            MuiTypography: {
              subtitle1: {
                lineHeight: 1.4,
              },
            },
          },
        })
      )
    );
  }

  const getConfig = useCallback(
    (userId: string) => {
      (async (): Promise<void> => {
        const configService = await client.service("config");
        const getter = await configService.find({ userId });

        if (!getter.data[0]) {
          await configService.create({ createNew: true });
          getConfig(userId);
          return;
        }

        process.env.NODE_ENV === "development" &&
          console.log("Config:", getter.data[0]);

        const configLcl = getter.data[0].config;
        setConfig(configLcl);
        setConfigId(getter.data[0]._id);

        if (configLcl.theme) handleSetTheme(configLcl.theme);

        configService.on(
          "patched",
          (message: { userId: string; config: ConfigurationProps }) => {
            if (
              message.userId === getter.data[0].userId &&
              config !== message.config
            ) {
              console.log("Update Config:", message.config);
              setConfig(message.config);
            }
          }
        );
      })();
    },
    [config]
  );

  function handleCommand(message: CommandType): void {
    console.log("Command Received:", message);
    setCommand(message);
    setTimeout(async () => setCommand(undefined), 200);
  }

  const handleLogin = useCallback(
    (data?: Auth, callback?: (error?: string) => void) => {
      (async (): Promise<void> => {
        try {
          let clientData: AuthenticationResult;
          if (!client) {
            console.warn("Feathers app is undefined");
            return;
          } else if (!data) clientData = await client.reAuthenticate();
          else clientData = await client.authenticate(data, callback);
          console.log("User:", clientData.user);
          setLoginCredentials(clientData.user);
          setLoginAttempt(-1);
          getConfig(clientData.user._id);
          const controllerService = await client.service("controller");
          controllerService.on("created", handleCommand);
        } catch (error) {
          console.error("Error in handleLogin:", error);
          setLoginAttempt(2);
          setLoginCredentials(undefined);
          if (callback) callback(`Login error: ${error.message}`);
        }
      })();
    },
    [getConfig]
  );

  useEffect(() => {
    if (!loginCredentials) handleLogin();
  }, [loginCredentials, handleLogin]);

  function handleCreateAccount(
    data: Auth,
    callback?: (error?: string) => void
  ): void {
    socket.emit("create", "users", data, (error: { message: string }) => {
      if (error) {
        console.error("Error creating account:", error);
        if (callback) callback(`Error creating account: ${error.message}`);
      } else {
        handleLogin(data, callback);
      }
    });
  }

  async function handleLogout(): Promise<void> {
    localStorage.removeItem("hass_tokens");
    localStorage.removeItem("hass_url");
    await client.logout();
    window.location.replace(window.location.href);
  }

  function handleConfigChange(config: ConfigurationProps): void {
    socket.emit(
      "patch",
      "config",
      configId,
      { config },
      (error: { message: string }) => {
        if (error) console.error("Error updating", configId, ":", error);
        else {
          setConfig(config);
          process.env.NODE_ENV === "development" &&
            console.log("Updated config:", configId, config);
        }
      }
    );
  }

  async function handleMouseMove(): Promise<void> {
    if (moveTimeout) clearTimeout(moveTimeout);
    if (currentPage !== "Configuration") {
      setMouseMoved(true);
      moveTimeout = setTimeout(async () => setMouseMoved(false), 4000);
    }
  }

  function handleSetCurrentPage(page: Page) {
    setCurrentPage(page);
  }

  useEffect(() => {
    if (config && loginCredentials) {
      setLoginAttempt(1);
    }
  }, [config, loginCredentials]);

  const cssOverrides = `
    a {
      color: ${
        (config && config.theme && config.theme.link_color) ||
        defaultTheme.link_color
      };
    }
    ::-webkit-scrollbar-thumb {
      visibility: ${mouseMoved ? "visible" : "hidden"};
    }
  `;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{cssOverrides}</style>
      {loginAttempt === -2 || loginAttempt === -1 ? (
        <Loading
          text={`${
            loginAttempt === -2 ? "Attempting Login" : "Loading Config"
          }. Please Wait..`}
        />
      ) : config && loginCredentials ? (
        <Main
          command={command}
          config={config}
          currentPage={currentPage}
          editing={0}
          loginCredentials={loginCredentials}
          mouseMoved={mouseMoved}
          handleConfigChange={handleConfigChange}
          handleLogout={handleLogout}
          handleMouseMove={handleMouseMove}
          handleSetCurrentPage={handleSetCurrentPage}
          handleSetTheme={handleSetTheme}
        />
      ) : (
        <Login
          handleCreateAccount={handleCreateAccount}
          handleSetCurrentPage={handleSetCurrentPage}
          handleLogin={handleLogin}
        />
      )}
    </ThemeProvider>
  );
}

export default Onboarding;
