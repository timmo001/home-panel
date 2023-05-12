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
  HassUser,
  subscribeConfig,
  subscribeEntities,
} from "home-assistant-js-websocket";

import {
  homeAssistantGetConfig,
  homeAssistantUpdateConfig,
} from "@/utils/serverActions/homeAssistant";

export class HomeAssistant {
  public connection: Connection | null = null;
  public dashboardId: string;

  private connectionCallback: (connected: boolean) => void;
  private configCallback: (config: HassConfig) => void;
  private entitiesCallback: (entities: HassEntities) => void;

  constructor(
    dashboardId: string,
    connectionCallback: (connected: boolean) => void,
    configCallback: (config: HassConfig) => void,
    entitiesCallback: (entities: HassEntities) => void
  ) {
    this.dashboardId = dashboardId;
    this.connectionCallback = connectionCallback;
    this.configCallback = configCallback;
    this.entitiesCallback = entitiesCallback;
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
    // Get home assistant config from database
    let config: HomeAssistantConfig = await homeAssistantGetConfig(
      this.dashboardId
    );

    const auth: Auth = await getAuth({
      hassUrl: config.url,
      loadTokens: async (): Promise<AuthData | null | undefined> => {
        config = await homeAssistantGetConfig(this.dashboardId);
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
        await homeAssistantUpdateConfig(this.dashboardId, {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          clientId: data.clientId,
          expires: data.expires,
          expiresIn: data.expires_in,
        });
      },
    });

    this.connection = await createConnection({ auth });
    this.connection.addEventListener("ready", () => {
      console.log("Connected to Home Assistant");
      this.connectionCallback(true);
    });
    this.connection.addEventListener("disconnected", () => {
      console.log("Disconnected from Home Assistant");
      if (this.connection) this.connection.reconnect();
      this.connectionCallback(false);
    });

    subscribeConfig(this.connection, (config: HassConfig) => {
      console.log("Home Assistant config updated");
      this.configCallback(config);
    });
    subscribeEntities(this.connection, (entities: HassEntities) => {
      this.entitiesCallback(entities);
    });
    getUser(this.connection).then((user: HassUser) => {
      console.log("Logged into Home Assistant as", user.name);
    });
  }
}
