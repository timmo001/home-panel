"use server";
import type {
  Widget as WidgetModel,
  WidgetChecklistItem as WidgetChecklistItemModel,
  WidgetFrame as WidgetFrameModel,
  WidgetHomeAssistant as WidgetHomeAssistantModel,
  WidgetImage as WidgetImageModel,
  WidgetMarkdown as WidgetMarkdownModel,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/utils/prisma";
import { WidgetType } from "@/types/widget.type";

export async function widgetCreate(
  dashboardId: string,
  sectionId: string
): Promise<WidgetModel> {
  console.log("Create widget:", { dashboardId, sectionId });

  let newData = await prisma.widget.create({
    data: {
      type: WidgetType.Markdown,
      title: "",
      markdown: {
        create: {
          content: "",
        },
      },
      section: {
        connect: {
          id: sectionId,
        },
      },
    },
  });

  await widgetsReorganise(sectionId);

  await widgetRevalidate(dashboardId, sectionId, newData.id);
  newData = await prisma.widget.findUniqueOrThrow({
    where: { id: newData.id },
  });

  return newData;
}

export async function widgetDelete(
  dashboardId: string,
  id: string
): Promise<WidgetModel> {
  console.log("Delete widget:", { id });

  const data = await prisma.widget.delete({
    where: { id },
  });

  await widgetsReorganise(data.sectionId);

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
    case WidgetType.Checklist:
      data = await prisma.widgetChecklist.findUnique({
        include: { items: { orderBy: { position: "asc" } } },
        where: { widgetId },
      });
      if (data) return data;
      return await prisma.widgetChecklist.create({
        data: {
          items: {
            create: {
              content: "",
            },
          },
          widget: { connect: { id: widgetId } },
        },
        include: { items: true },
      });
    case WidgetType.Frame:
      data = await prisma.widgetFrame.findUnique({
        where: { widgetId },
      });
      if (data) return data;
      return await prisma.widgetFrame.create({
        data: {
          url: "",
          widget: { connect: { id: widgetId } },
        },
      });
    case WidgetType.HomeAssistant:
      data = await prisma.widgetHomeAssistant.findUnique({
        where: { widgetId },
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
    case WidgetType.Image:
      data = await prisma.widgetImage.findUnique({
        where: { widgetId },
      });
      if (data) return data;
      return await prisma.widgetImage.create({
        data: {
          url: "",
          widget: { connect: { id: widgetId } },
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

async function widgetsReorganise(sectionId: string): Promise<void> {
  console.log("Reorganise widgets:", { sectionId });
  const ids = await prisma.widget.findMany({
    select: { id: true },
    where: { sectionId },
    orderBy: { position: "asc" },
  });

  // Reorganise widget positions in 10s
  for (let i = 0; i < ids.length; i++) {
    const widget = ids[i];
    const newPosition = i * 10;
    console.log("Reorganise widget:", { index: i, id: widget.id, newPosition });
    await prisma.widget.update({
      data: { position: newPosition },
      where: { id: widget.id },
    });
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

  let newData = await prisma.widget.update({
    data: { [name]: value },
    where: { id: widgetId },
  });

  if (name === "position") {
    await widgetsReorganise(newData.sectionId);
    newData = await prisma.widget.findUniqueOrThrow({
      where: { id: widgetId },
    });
  }

  await widgetRevalidate(dashboardId, newData.sectionId, widgetId);

  console.log("New widget data:", newData);

  return newData;
}

export async function widgetChecklistUpdate(
  dashboardId: string,
  sectionId: string,
  widgetId: string,
  checklistItemId: string,
  name: keyof WidgetChecklistItemModel,
  value: WidgetChecklistItemModel[keyof WidgetChecklistItemModel]
): Promise<WidgetChecklistItemModel> {
  console.log("Update widget checklist:", {
    dashboardId,
    sectionId,
    widgetId,
    checklistItemId,
    name,
    value,
  });

  let newData: WidgetChecklistItemModel;
  if (name === "id" && value === "DELETE") {
    newData = await prisma.widgetChecklistItem.delete({
      where: {
        id: checklistItemId,
      },
    });
  } else {
    newData = await prisma.widgetChecklistItem.upsert({
      create: {
        content: "",
        position: 9999,
        [name]: value,
        checklist: {
          connect: {
            widgetId,
          },
        },
      },
      update: {
        [name]: value,
      },
      where: {
        id: checklistItemId,
      },
    });
  }

  // Sort checklist items
  const items = await prisma.widgetChecklistItem.findMany({
    select: { id: true },
    where: { checklist: { widgetId: widgetId } },
  });
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    await prisma.widgetChecklistItem.update({
      data: { position: i * 10 },
      where: { id: item.id },
    });
  }

  // Load new data with new position
  newData =
    (await prisma.widgetChecklistItem.findUnique({
      where: { id: newData.id },
    })) || newData;

  await widgetRevalidate(dashboardId, sectionId, widgetId);

  return newData;
}

export async function widgetFrameUpdate(
  dashboardId: string,
  sectionId: string,
  widgetId: string,
  name: string,
  value: any
): Promise<WidgetFrameModel> {
  console.log("Update widget frame:", {
    dashboardId,
    sectionId,
    widgetId,
    name,
    value,
  });

  const newData = await prisma.widgetFrame.update({
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

export async function widgetImageUpdate(
  dashboardId: string,
  sectionId: string,
  widgetId: string,
  name: string,
  value: any
): Promise<WidgetImageModel> {
  console.log("Update widget image:", {
    dashboardId,
    sectionId,
    widgetId,
    name,
    value,
  });

  const newData = await prisma.widgetImage.update({
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
