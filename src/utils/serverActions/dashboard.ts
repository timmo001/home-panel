"use server";
import type { Dashboard } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/utils/prisma";

export async function dashboardDelete(
  idOrDashboard: string | Dashboard
): Promise<Dashboard> {
  console.log("Delete dashboard:", { idOrDashboard });

  const data = await prisma.dashboard.delete({
    where: {
      id: typeof idOrDashboard === "string" ? idOrDashboard : idOrDashboard.id,
    },
  });

  revalidatePath("/dashboards");

  return data;
}

export async function dashboardUpdate(
  dashboardId: string,
  name: string,
  value: any
): Promise<Dashboard> {
  console.log("Update dashboard:", { dashboardId, name, value });

  const newData = await prisma.dashboard.update({
    data: {
      [name]: value,
    },
    where: {
      id: dashboardId,
    },
  });

  revalidatePath(`/dashboards/${dashboardId}`);

  return newData;
}