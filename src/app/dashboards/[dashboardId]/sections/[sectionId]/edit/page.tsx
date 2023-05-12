import type { Section } from "@prisma/client";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { EditSection } from "@/components/dashboard/editors/Section";
import { prisma } from "@/utils/prisma";

export const metadata: Metadata = {
  title: "Edit Item | Home Panel",
  description: "Edit Item - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { dashboardId: string; sectionId: string };
}): Promise<JSX.Element> {
  let data: Section | null = await prisma.section.findUnique({
    where: {
      id: params.sectionId,
    },
  });

  if (!data) {
    data = await prisma.section.create({
      data: {
        title: "Section",
        subtitle: "New section",
        width: "480px",
        dashboard: {
          connect: {
            id: params.dashboardId,
          },
        },
      },
    });
    redirect(`/dashboards/${params.dashboardId}/sections/${data.id}/edit`);
  }

  return <EditSection dashboardId={params.dashboardId} data={data} />;
}
