import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { WidgetWithSectionModel } from "@/types/widget.type";
import { EditWidget } from "@/components/dashboard/editors/Widget";
import { HomeAssistantProvider } from "@/providers/HomeAssistantProvider";
import { prisma } from "@/utils/prisma";
import { WidgetType } from "@/types/widget.type";

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

  if (!data) {
    console.log("Creating new widget");
    data = await prisma.widget.create({
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
            id: params.sectionId,
          },
        },
      },
      include: {
        section: true,
      },
    });
    revalidatePath(
      `/dashboards/${params.dashboardId}/sections/${params.sectionId}/widgets/${data.id}/edit`
    );
    return redirect(
      `/dashboards/${params.dashboardId}/sections/${params.sectionId}/widgets/${data.id}/edit`
    );
  }

  return (
    <HomeAssistantProvider dashboardId={params.dashboardId}>
      <EditWidget dashboardId={params.dashboardId} data={data} />
    </HomeAssistantProvider>
  );
}
