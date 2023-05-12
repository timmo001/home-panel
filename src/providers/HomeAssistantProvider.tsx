"use client";
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

const HomeAssistantContext = createContext<Connection | null>(null);

export function HomeAssistantProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    let connection: Connection;
    (async () => {
      connection = await createConnection({
        // configuration options here
      });
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
  }, []);
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
