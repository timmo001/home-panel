import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { WidgetModel } from "@/types/widget.type";
import { EditWidget } from "@/components/dashboard/editors/Widget";
import { HomeAssistantProvider } from "@/providers/HomeAssistantProvider";
import { prisma } from "@/utils/prisma";
import { widgetGetData } from "@/utils/serverActions/widget";

export const metadata: Metadata = {
  title: "Edit Widget | Home Panel",
  description: "Edit Widget - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { dashboardId: string; sectionId: string; widgetId: string };
}): Promise<JSX.Element> {
  console.log("Edit Widget:", params);

  let widget: WidgetModel | null = (await prisma.widget.findUnique({
    where: {
      id: params.widgetId,
    },
  })) as WidgetModel | null;

  if (!widget) return notFound();

  widget.data = await widgetGetData(widget.id, widget.type);

  return (
    <HomeAssistantProvider dashboardId={params.dashboardId}>
      <EditWidget dashboardId={params.dashboardId} data={widget} />
    </HomeAssistantProvider>
  );
}
