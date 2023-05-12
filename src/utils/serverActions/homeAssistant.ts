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

  return await prisma.homeAssistant.update({
    data,
    where: {
      dashboardId,
    },
  });
}
