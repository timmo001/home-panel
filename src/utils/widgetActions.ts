"use server";
import type { Widget as WidgetModel } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/utils/prisma";

export async function widgetDelete(
  dashboardId: string,
  idOrWidget: string | WidgetModel
): Promise<WidgetModel> {
  console.log("Delete widget:", idOrWidget);

  const data = await prisma.widget.delete({
    where: {
      id: typeof idOrWidget === "string" ? idOrWidget : idOrWidget.id,
    },
  });

  revalidatePath(`/dashboards/${dashboardId}`);

  return data;
}

export async function widgetGetData(
  widgetId: string,
  type: string
): Promise<any> {
  console.log("Get widget data:", widgetId, type);
  switch (type) {
    case "markdown":
      return await prisma.widgetMarkdown.findUniqueOrThrow({
        where: {
          widgetId,
        },
      });
    default:
      throw new Error(`Unknown widget type: ${type}`);
  }
}

export async function widgetUpdate(
  dashboardId: string,
  widgetId: string,
  name: string,
  value: any
): Promise<WidgetModel> {
  console.log("Update widget:", dashboardId, widgetId, name, value);

  const newData = await prisma.widget.update({
    data: {
      [name]: value,
    },
    where: {
      id: widgetId,
    },
  });

  revalidatePath(`/dashboards/${dashboardId}`);
  revalidatePath(
    `/dashboards/${dashboardId}/sections/${newData.sectionId}/widgets/${newData.id}/edit`
  );

  return newData;
}
