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

  constructor(dashboardId: string, callback: (connected: boolean) => void) {
    this.dashboardId = dashboardId;
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
      setHomeAssistant(connection);
    });
    this.connection.addEventListener("disconnected", () => {
      console.log("Disconnected from Home Assistant");
      if (this.connection) this.connection.reconnect();
      setHomeAssistant(null);
    });
  }
}
