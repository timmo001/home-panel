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
  HassEntity,
  HassServices,
  HassUser,
  subscribeConfig,
  subscribeEntities,
  subscribeServices,
} from "home-assistant-js-websocket";

import { homeAssistantUpdateConfig } from "@/utils/serverActions/homeAssistant";

export function getToggleServiceFromDomain(
  domain: string,
  turnOn: boolean = true
) {
  switch (domain) {
    case "lock":
      return turnOn ? "unlock" : "lock";
    case "cover":
      return turnOn ? "open_cover" : "close_cover";
    case "button":
    case "input_button":
      return "press";
    case "scene":
      return "turn_on";
    default:
      return turnOn ? "turn_on" : "turn_off";
  }
}

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
  public haConfig: HassConfig | null = null;
  public haEntities: HassEntities | null = null;
  public haServices: HassServices | null = null;
  public haUser: HassUser | null = null;

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

  public baseUrl(): string | null {
    return this.config?.url || null;
  }

  public connected: boolean = this.connection !== null;

  async callService(
    domain: string,
    service: string,
    serviceData: Record<string, unknown>
  ): Promise<unknown> {
    if (!this.connection) return;
    console.log("Call Home Assistant service:", {
      domain,
      service,
      serviceData,
    });
    return await callService(this.connection, domain, service, serviceData);
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

    subscribeConfig(this.connection, (config: HassConfig) => {
      console.log("Home Assistant config updated");
      this.haConfig = config;
      this.configCallback(config);
    });

    subscribeEntities(this.connection, (entities: HassEntities) => {
      this.haEntities = entities;
      this.entitiesCallback(entities);
    });

    subscribeServices(this.connection, (services) => {
      this.haServices = services;
      this.servicesCallback(services);
    });

    getUser(this.connection).then((user: HassUser) => {
      console.log("Logged into Home Assistant as", user.name);
      this.haUser = user;
      this.connectedCallback();
    });
  }

  entityCanTurnOnOff(entity: HassEntity | undefined): boolean {
    if (!entity) return false;
    const domain = entity.entity_id.split(".")[0];
    const service = getToggleServiceFromDomain(domain);
    if (this.haServices?.[domain]?.[service]) return true;
    return false;
  }

  async entityTurnOnOff(entity: HassEntity, turnOn = true): Promise<unknown> {
    if (!this.connection) return;
    const domain = entity.entity_id.split(".")[0];

    return await this.callService(
      domain === "group" ? "homeassistant" : domain,
      getToggleServiceFromDomain(domain, turnOn),
      {
        entity_id: entity.entity_id,
      }
    );
  }
}
