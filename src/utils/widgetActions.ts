"use server";
import type { Prisma, Widget } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/utils/prisma";

export async function widgetCreate(
  data: Prisma.WidgetCreateInput
): Promise<void> {
  console.log("Create widget:", data);

  const newData = await prisma.widget.create({
    data,
  });

  revalidatePath(
    `/dashboards/${newData.dashboardId}/sections/${newData.sectionId}/widgets/${newData.id}/edit`
  );
}

export async function widgetDelete(
  idOrWidget: string | Widget
): Promise<Widget> {
  console.log("Delete widget:", idOrWidget);

  return await prisma.widget.delete({
    where: {
      id: typeof idOrWidget === "string" ? idOrWidget : idOrWidget.id,
    },
  });
}

export async function widgetGet(id: string): Promise<Widget | null> {
  console.log("Get widget:", id);

  return await prisma.widget.findUnique({
    where: {
      id,
    },
  });
}

export async function widgetUpdate(data: Widget): Promise<Widget> {
  console.log("Update widget:", data);

  const newData = await prisma.widget.update({
    data,
    where: {
      id: data.id,
    },
  });

  revalidatePath(
    `/dashboards/${newData.dashboardId}/sections/${newData.sectionId}/widgets/${newData.id}/edit`
  );

  return newData;
}
