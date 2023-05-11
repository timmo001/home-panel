import type { Metadata } from "next";

import type { WidgetWithSectionModel } from "@/types/widget.type";
import { EditWidget } from "@/components/dashboard/editors/Widget";
import { prisma } from "@/utils/prisma";

export const metadata: Metadata = {
  title: "Edit Item | Home Panel",
  description: "Edit Item - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { dashboardId: string; sectionId: string; widgetId: string };
}): Promise<JSX.Element> {
  let data: WidgetWithSectionModel | null = await prisma.widget.findUnique({
    where: {
      id: params.widgetId,
    },
    include: {
      section: true,
    },
  });

  if (!data)
    data = await prisma.widget.create({
      data: {
        type: "markdown",
        title: "",
        markdown: {
          create: {
            content: "",
          },
        },
        section: {
          connect: {
            id: params.sectionId,
          },
        },
      },
      include: {
        section: true,
      },
    });

  return <EditWidget dashboardId={params.dashboardId} data={data} />;
}
