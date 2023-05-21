"use client";
import { HomeAssistant as HomeAssistantConfig } from "@prisma/client";
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
  HassServices,
  HassUser,
  subscribeConfig,
  subscribeEntities,
  subscribeServices,
} from "home-assistant-js-websocket";

import { homeAssistantUpdateConfig } from "@/utils/serverActions/homeAssistant";

async function loadTokens(
  config: HomeAssistantConfig
): Promise<AuthData | null> {
  console.log("Load Home Assistant tokens:", config);

  if (
    !config.accessToken ||
    !config.refreshToken ||
    !config.clientId ||
    !config.expires ||
    !config.expiresIn ||
    !config.url
  )
    return null;

  return {
    access_token: config.accessToken,
    refresh_token: config.refreshToken,
    clientId: config.clientId,
    expires: Number(config.expires),
    expires_in: config.expiresIn,
    hassUrl: config.url,
  };
}

async function saveTokens(
  dashboardId: string,
  data: AuthData | null
): Promise<void> {
  console.log("Save Home Assistant tokens:", data);

  await homeAssistantUpdateConfig(dashboardId, {
    accessToken: data?.access_token,
    refreshToken: data?.refresh_token,
    clientId: data?.clientId,
    expires: data?.expires,
    expiresIn: data?.expires_in,
  });
}

export class HomeAssistant {
  public config: HomeAssistantConfig | null = null;
  public connection: Connection | null = null;
  public dashboardId: string;

  private auth: Auth | null = null;
  private configCallback: (config: HassConfig) => void;
  private connectedCallback: () => void;
  private entitiesCallback: (entities: HassEntities) => void;
  private servicesCallback: (services: HassServices) => void;

  constructor(
    dashboardId: string,
    connectedCallback?: () => void,
    configCallback?: (config: HassConfig) => void,
    entitiesCallback?: (entities: HassEntities) => void,
    servicesCallback?: (services: HassServices) => void,
    connection?: Connection,
    config?: HomeAssistantConfig
  ) {
    this.dashboardId = dashboardId;
    this.connectedCallback = connectedCallback || (() => {});
    this.configCallback = configCallback || (() => {});
    this.entitiesCallback = entitiesCallback || (() => {});
    this.servicesCallback = servicesCallback || (() => {});
    this.connection = connection || null;
    this.config = config || null;
  }

  baseUrl(): string | null {
    return this.connection?.options.auth?.data.hassUrl || null;
  }

  async callService(
    domain: string,
    service: string,
    serviceData: Record<string, unknown>
  ): Promise<void> {
    if (!this.connection) return;
    await callService(this.connection, domain, service, serviceData);
  }

  connected(): boolean {
    return this.connection !== null;
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
  }

  async connect(): Promise<void> {
    if (this.connection) return;
    if (!this.config) throw new Error("Config not loaded");

    console.log("Connecting to Home Assistant:", this.config);

    try {
      // Create auth object
      this.auth = await getAuth({
        hassUrl: this.config.url,
        loadTokens: async (): Promise<AuthData | null | undefined> => {
          if (!this.config) {
            console.error("loadTokens - Config not loaded");
            return undefined;
          }
          return await loadTokens(this.config);
        },
        saveTokens: async (data: AuthData | null) =>
          await saveTokens(this.dashboardId, data),
      });

      // Connect to Home Assistant
      this.connection = await createConnection({ auth: this.auth });
    } catch (err) {
      console.warn("Failed to connect to Home Assistant:", err);
      if (err !== ERR_HASS_HOST_REQUIRED && err !== ERR_INVALID_AUTH) throw err;

      // Clear stored tokens
      await saveTokens(this.dashboardId, null);

      if (err === ERR_HASS_HOST_REQUIRED)
        throw new Error("No Home Assistant URL provided");

      console.warn("Invalid Home Assistant credentials");
      this.auth = await getAuth({ hassUrl: this.config.url });
      return;
    }

    this.connection.addEventListener("ready", () => {
      console.log("Home Assistant connection ready");
    });

    this.connection.addEventListener("disconnected", () => {
      console.log("Disconnected from Home Assistant");
      if (this.connection) this.connection.reconnect();
    });

    getUser(this.connection).then((user: HassUser) => {
      console.log("Logged into Home Assistant as", user.name);
      this.connectedCallback();
    });

    subscribeConfig(this.connection, (config: HassConfig) => {
      console.log("Home Assistant config updated");
      this.configCallback(config);
    });

    subscribeEntities(this.connection, (entities: HassEntities) => {
      this.entitiesCallback(entities);
    });

    subscribeServices(this.connection, (services) => {
      this.servicesCallback(services);
    });
  }
}
