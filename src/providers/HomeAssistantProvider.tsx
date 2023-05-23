"use client";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  HassConfig,
  HassEntities,
  HassServices,
} from "home-assistant-js-websocket";
import { usePathname, useRouter } from "next/navigation";

import { HomeAssistant } from "@/utils/homeAssistant";
import { homeAssistantGetConfig } from "@/utils/serverActions/homeAssistant";

type HomeAssistantContextType = {
  client: HomeAssistant | null;
  config: HassConfig | null;
  entities: HassEntities | null;
  services: HassServices | null;
};

const defaultHomeAssistantContext: HomeAssistantContextType = {
  client: null,
  config: null,
  entities: null,
  services: null,
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
  const pathname = usePathname();
  const router = useRouter();

  const [homeAssistant, setHomeAssistant] = useState<HomeAssistantContextType>(
    defaultHomeAssistantContext
  );

  const connectedCallback = useCallback((): void => {
    console.log("Connected to Home Assistant");
    setHomeAssistant((prevHomeAssistant: HomeAssistantContextType) => ({
      ...prevHomeAssistant,
      client,
    }));

    // Cleanup search params
    router.replace(pathname);
  }, [pathname, router, setHomeAssistant]);

  const configCallback = useCallback(
    (config: HassConfig): void => {
      setHomeAssistant((prevHomeAssistant: HomeAssistantContextType) => ({
        ...prevHomeAssistant,
        config,
      }));
    },
    [setHomeAssistant]
  );

  const entitiesCallback = useCallback(
    (entities: HassEntities): void => {
      setHomeAssistant((prevHomeAssistant: HomeAssistantContextType) => ({
        ...prevHomeAssistant,
        entities,
      }));
    },
    [setHomeAssistant]
  );

  const servicesCallback = useCallback(
    (services: HassServices): void => {
      setHomeAssistant((prevHomeAssistant: HomeAssistantContextType) => ({
        ...prevHomeAssistant,
        services,
      }));
    },
    [setHomeAssistant]
  );

  useEffect(() => {
    if (!dashboardId) return;

    console.log("Connecting to Home Assistant:", { dashboardId });

    client = new HomeAssistant(
      dashboardId,
      connectedCallback,
      configCallback,
      entitiesCallback,
      servicesCallback
    );

    (async () => {
      // Get home assistant config from database
      client.config = await homeAssistantGetConfig(dashboardId);

      if (!client.config) {
        console.warn("No config found for dashboard:", { dashboardId });
        return;
      }

      if (!client.config.url) {
        console.warn("No url found for dashboard:", { dashboardId });
        return;
      }

      try {
        await client.connect();
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      if (client) client.disconnect();
      setHomeAssistant(defaultHomeAssistantContext);
    };
  }, [
    configCallback,
    connectedCallback,
    dashboardId,
    entitiesCallback,
    servicesCallback,
  ]);

  return (
    <HomeAssistantContext.Provider value={homeAssistant}>
      {children}
    </HomeAssistantContext.Provider>
  );
}

export function useHomeAssistant(): HomeAssistantContextType {
  return useContext<HomeAssistantContextType>(HomeAssistantContext);
}
