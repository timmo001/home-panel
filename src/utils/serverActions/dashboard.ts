"use server";
import type { Dashboard, HeaderItem } from "@prisma/client";
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
  revalidatePath(`/dashboards/${dashboardId}/edit`);

  return newData;
}

export async function dashboardHeaderUpdate(
  dashboardId: string,
  items: Array<string>
): Promise<Array<HeaderItem>> {
  console.log("Update dashboard header:", { dashboardId, items });

  await prisma.headerItem.deleteMany({
    where: {
      dashboardId: dashboardId,
    },
  });

  let position = 0;
  for (const type of items) {
    position += 10;
    await prisma.headerItem.create({
      data: {
        position,
        type,
        dashboard: {
          connect: {
            id: dashboardId,
          },
        },
      },
    });
  }

  const newData = await prisma.headerItem.findMany({
    where: {
      dashboardId: dashboardId,
    },
  });

  console.log("New header items:", newData);

  revalidatePath(`/dashboards/${dashboardId}`);
  revalidatePath(`/dashboards/${dashboardId}/edit`);

  return newData;
}
