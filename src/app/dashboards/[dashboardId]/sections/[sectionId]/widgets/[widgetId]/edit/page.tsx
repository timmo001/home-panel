import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { WidgetWithSectionModel } from "@/types/widget.type";
import { EditWidget } from "@/components/dashboard/editors/Widget";
import { HomeAssistantProvider } from "@/providers/HomeAssistantProvider";
import { prisma } from "@/utils/prisma";

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

  let data: WidgetWithSectionModel | null = await prisma.widget.findUnique({
    where: {
      id: params.widgetId,
    },
    include: {
      section: true,
    },
  });

  if (!data) return notFound();

  return (
    <HomeAssistantProvider dashboardId={params.dashboardId}>
      <EditWidget dashboardId={params.dashboardId} data={data} />
    </HomeAssistantProvider>
  );
}
