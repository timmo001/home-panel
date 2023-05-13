"use server";
import type {
  Widget as WidgetModel,
  WidgetHomeAssistant as WidgetHomeAssistantModel,
  WidgetMarkdown as WidgetMarkdownModel,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/utils/prisma";
import { WidgetType } from "@/types/widget.type";

export async function widgetDelete(
  dashboardId: string,
  idOrWidget: string | WidgetModel
): Promise<WidgetModel> {
  console.log("Delete widget:", { idOrWidget });

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
  console.log("Get widget data:", { widgetId, type });
  let data;
  switch (type) {
    case WidgetType.HomeAssistant:
      data = await prisma.widgetHomeAssistant.findUnique({
        where: {
          widgetId,
        },
      });
      if (data) return data;
      return await prisma.widgetHomeAssistant.create({
        data: {
          entityId: "",
          widget: { connect: { id: widgetId } },
          showName: true,
          showIcon: true,
          showState: true,
        },
      });
    case WidgetType.Markdown:
      data = await prisma.widgetMarkdown.findUnique({
        where: {
          widgetId,
        },
      });
      if (data) return data;
      return await prisma.widgetMarkdown.create({
        data: {
          content: "",
          widget: { connect: { id: widgetId } },
        },
      });
    default:
      throw new Error(`Unknown widget type: ${type}`);
  }
}

async function widgetRevalidate(
  dashboardId: string,
  sectionId: string,
  widgetId: string
) {
  revalidatePath(`/dashboards/${dashboardId}`);
  revalidatePath(
    `/dashboards/${dashboardId}/sections/${sectionId}/widgets/${widgetId}/edit`
  );
}

export async function widgetUpdate(
  dashboardId: string,
  widgetId: string,
  name: string,
  value: any
): Promise<WidgetModel> {
  console.log("Update widget:", { dashboardId, widgetId, name, value });

  const newData = await prisma.widget.update({
    data: {
      [name]: value,
    },
    where: {
      id: widgetId,
    },
  });

  await widgetRevalidate(dashboardId, newData.sectionId, widgetId);

  return newData;
}

export async function widgetHomeAssistantUpdate(
  dashboardId: string,
  sectionId: string,
  widgetId: string,
  name: string,
  value: any
): Promise<WidgetHomeAssistantModel> {
  console.log("Update widget home assistant:", {
    dashboardId,
    sectionId,
    widgetId,
    name,
    value,
  });

  const newData = await prisma.widgetHomeAssistant.update({
    data: {
      [name]: value,
    },
    where: {
      widgetId,
    },
  });

  await widgetRevalidate(dashboardId, sectionId, widgetId);

  return newData;
}

export async function widgetMarkdownUpdate(
  dashboardId: string,
  sectionId: string,
  widgetId: string,
  name: string,
  value: any
): Promise<WidgetMarkdownModel> {
  console.log("Update widget markdown:", {
    dashboardId,
    sectionId,
    widgetId,
    name,
    value,
  });

  const newData = await prisma.widgetMarkdown.update({
    data: {
      [name]: value,
    },
    where: {
      widgetId,
    },
  });

  await widgetRevalidate(dashboardId, sectionId, widgetId);

  return newData;
}
