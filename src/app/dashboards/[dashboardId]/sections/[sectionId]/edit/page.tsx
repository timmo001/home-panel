import type { Section } from "@prisma/client";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { EditSection } from "@/components/dashboard/editors/Section";
import { prisma } from "@/utils/prisma";

export const metadata: Metadata = {
  title: "Edit Section | Home Panel",
  description: "Edit Section - Home Panel",
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
    console.log("Creating new section");
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
    revalidatePath(
      `/dashboards/${params.dashboardId}/sections/${data.id}/edit`
    );
    return redirect(
      `/dashboards/${params.dashboardId}/sections/${data.id}/edit`
    );
  }

  return <EditSection dashboardId={params.dashboardId} data={data} />;
}
