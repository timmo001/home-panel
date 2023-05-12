"use client";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { HassConfig, HassEntities } from "home-assistant-js-websocket";

import { HomeAssistant } from "@/utils/homeAssistant";

type HomeAssistantContextType = {
  client: HomeAssistant | null;
  config: HassConfig | null;
  entities: HassEntities | null;
};

const defaultHomeAssistantContext: HomeAssistantContextType = {
  client: null,
  config: null,
  entities: null,
};

const HomeAssistantContext = createContext<HomeAssistantContextType>(
  defaultHomeAssistantContext
);

let client: HomeAssistant | null = null;

export function HomeAssistantProvider({
  dashboardId,
  children,
}: {
  dashboardId: string;
  children: ReactNode;
}): JSX.Element {
  const [homeAssistant, setHomeAssistant] = useState<HomeAssistantContextType>(
    defaultHomeAssistantContext
  );

  const connectedCallback = useCallback((client: HomeAssistant): void => {
    setHomeAssistant((prevHomeAssistant: HomeAssistantContextType) => ({
      ...prevHomeAssistant,
      client,
    }));
  }, []);

  const configCallback = useCallback((config: HassConfig): void => {
    setHomeAssistant((prevHomeAssistant: HomeAssistantContextType) => ({
      ...prevHomeAssistant,
      config,
    }));
  }, []);

  const entitiesCallback = useCallback((entities: HassEntities): void => {
    setHomeAssistant((prevHomeAssistant: HomeAssistantContextType) => ({
      ...prevHomeAssistant,
      entities,
    }));
  }, []);

  useEffect(() => {
    client = new HomeAssistant(
      dashboardId,
      connectedCallback,
      configCallback,
      entitiesCallback
    );
    try {
      client.connect();
    } catch (e) {
      console.warn(e);
    }

    return () => {
      if (client) client.disconnect();
      setHomeAssistant(defaultHomeAssistantContext);
    };
  }, [configCallback, connectedCallback, dashboardId, entitiesCallback]);

  return (
    <HomeAssistantContext.Provider value={homeAssistant}>
      {children}
    </HomeAssistantContext.Provider>
  );
}

export function useHomeAssistant(): HomeAssistantContextType {
  return useContext<HomeAssistantContextType>(HomeAssistantContext);
}
