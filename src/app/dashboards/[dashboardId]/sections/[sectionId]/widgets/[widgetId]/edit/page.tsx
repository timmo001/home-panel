import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { SectionModel } from "@/types/section.type";
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

  const section: SectionModel | null = (await prisma.section.findUnique({
    include: {
      widgets: {
        where: {
          id: params.widgetId,
        },
      },
    },
    where: {
      id: params.sectionId,
    },
  })) as SectionModel | null;

  if (!section) return notFound();

  for (const widget of section.widgets) {
    widget.data = await widgetGetData(widget.id, widget.type);
  }

  return (
    <HomeAssistantProvider dashboardId={params.dashboardId}>
      <EditWidget dashboardId={params.dashboardId} section={section} />
    </HomeAssistantProvider>
  );
}
