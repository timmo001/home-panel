"use client";
import { HomeAssistant as HomeAssistantConfig } from "@prisma/client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Auth,
  AuthData,
  callService,
  Connection,
  createConnection,
  ERR_HASS_HOST_REQUIRED,
  ERR_INVALID_AUTH,
  getAuth,
  getUser,
  HassConfig,
  HassEntities,
  HassUser,
  subscribeConfig,
  subscribeEntities,
} from "home-assistant-js-websocket";

import {
  homeAssistantGetConfig,
  homeAssistantUpdateConfig,
} from "@/utils/serverActions/homeAssistant";

const HomeAssistantContext = createContext<Connection | null>(null);

export function HomeAssistantProvider({
  dashboardId,
  children,
}: {
  dashboardId: string;
  children: ReactNode;
}): JSX.Element {
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    let connection: Connection;
    (async () => {
      // Get home assistant config from database
      let config: HomeAssistantConfig = await homeAssistantGetConfig(
        dashboardId
      );

      const auth: Auth = await getAuth({
        hassUrl: config.url,
        loadTokens: async (): Promise<AuthData | null | undefined> => {
          config = await homeAssistantGetConfig(dashboardId);
          if (
            !config.accessToken ||
            !config.refreshToken ||
            !config.expires ||
            !config.expiresIn
          )
            return null;
          return {
            access_token: config.accessToken,
            refresh_token: config.refreshToken,
            clientId: config.clientId,
            expires: config.expires,
            expires_in: config.expiresIn,
            hassUrl: config.url,
          };
        },
        saveTokens: async (data: AuthData | null) => {
          if (!data) return;
          await homeAssistantUpdateConfig(dashboardId, {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            clientId: data.clientId,
            expires: data.expires,
            expiresIn: data.expires_in,
          });
        },
      });

      connection = await createConnection({ auth });
      connection.addEventListener("ready", () => {
        console.log("Connected to Home Assistant");
        setConnection(connection);
      });
      connection.addEventListener("disconnected", () => {
        console.log("Disconnected from Home Assistant");
        connection.reconnect();
        setConnection(null);
      });
    })();

    return () => {
      connection.close();
    };
  }, [dashboardId]);
  return (
    <HomeAssistantContext.Provider value={connection}>
      {children}
    </HomeAssistantContext.Provider>
  );
}

export function useHomeAssistant(): Connection {
  const connection = useContext(HomeAssistantContext);
  if (!connection) {
    throw new Error(
      "useHomeAssistant must be used within a HomeAssistantProvider"
    );
  }
  return connection;
}
