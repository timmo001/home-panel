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
  client: HomeAssistant;
  config?: HassConfig;
  entities?: HassEntities;
};

const HomeAssistantContext = createContext<HomeAssistantContextType | null>(
  null
);

export function HomeAssistantProvider({
  dashboardId,
  children,
}: {
  dashboardId: string;
  children: ReactNode;
}): JSX.Element {
  const [homeAssistant, setHomeAssistant] =
    useState<HomeAssistantContextType | null>(null);

  const configCallback = useCallback(
    (config: HassConfig): void => {
      setHomeAssistant(homeAssistant ? { ...homeAssistant, config } : null);
    },
    [homeAssistant]
  );

  const entitiesCallback = useCallback(
    (entities: HassEntities): void => {
      setHomeAssistant(homeAssistant ? { ...homeAssistant, entities } : null);
    },
    [homeAssistant]
  );

  useEffect(() => {
    const client = new HomeAssistant(
      dashboardId,
      (connected: boolean): void => {
        setHomeAssistant(connected ? { client } : null);
      },
      configCallback,
      entitiesCallback
    );
    try {
      client.connect();
    } catch (e) {
      console.warn(e);
    }

    return () => {
      client.disconnect();
      setHomeAssistant(null);
    };
  }, [dashboardId, configCallback, entitiesCallback]);

  return (
    <HomeAssistantContext.Provider value={homeAssistant}>
      {children}
    </HomeAssistantContext.Provider>
  );
}

export function useHomeAssistant(): HomeAssistantContextType | null {
  const homeAssistantContext = useContext<HomeAssistantContextType | null>(
    HomeAssistantContext
  );
  if (!homeAssistantContext) {
    throw new Error(
      "useHomeAssistant must be used within a HomeAssistantProvider"
    );
  }
  return homeAssistantContext;
}
