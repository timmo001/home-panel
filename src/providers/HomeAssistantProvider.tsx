"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { HomeAssistant } from "@/utils/homeAssistant";

const HomeAssistantContext = createContext<HomeAssistant | null>(null);

export function HomeAssistantProvider({
  dashboardId,
  children,
}: {
  dashboardId: string;
  children: ReactNode;
}): JSX.Element {
  const [homeAssistant, setHomeAssistant] = useState<HomeAssistant | null>(
    null
  );

  useEffect(() => {
    const client = new HomeAssistant(
      dashboardId,
      (connected: boolean): void => {
        setHomeAssistant(connected ? client : null);
      }
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
  }, [dashboardId]);
  return (
    <HomeAssistantContext.Provider value={homeAssistant}>
      {children}
    </HomeAssistantContext.Provider>
  );
}

export function useHomeAssistant(): HomeAssistant {
  const client = useContext<HomeAssistant | null>(HomeAssistantContext);
  if (!client) {
    throw new Error(
      "useHomeAssistant must be used within a HomeAssistantProvider"
    );
  }
  return client;
}