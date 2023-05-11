"use server";
import type { Prisma, Widget } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/utils/prisma";

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

export async function widgetUpdate(
  dashboardId: string,
  widgetId: string,
  name: string,
  value: any
): Promise<Widget> {
  console.log("Update widget:", dashboardId, widgetId, name, value);

  const newData = await prisma.widget.update({
    data: {
      [name]: value,
    },
    where: {
      id: widgetId,
    },
  });

  revalidatePath(
    `/dashboards/${dashboardId}/sections/${newData.sectionId}/widgets/${newData.id}/edit`
  );

  return newData;
}
