"use server";
import type {
  HomeAssistant as HomeAssistantConfig,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/utils/prisma";

export async function homeAssistantGetConfig(
  dashboardId: string
): Promise<HomeAssistantConfig> {
  console.log("Get Home Assistant config:", { dashboardId });
  if (!dashboardId) throw new Error("Dashboard ID is required");

  return await prisma.homeAssistant.findUniqueOrThrow({
    where: {
      dashboardId,
    },
  });
}

export async function homeAssistantUpdateConfig(
  dashboardId: string,
  data: Prisma.HomeAssistantUpdateInput
): Promise<HomeAssistantConfig> {
  console.log("Update Home Assistant config:", { dashboardId, data });
  if (!dashboardId) throw new Error("Dashboard ID is required");

  return await prisma.homeAssistant.update({
    data,
    where: {
      dashboardId,
    },
  });
}
