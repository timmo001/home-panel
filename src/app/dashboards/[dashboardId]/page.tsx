import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { DashboardModel } from "@/types/dashboard.type";
import type { SectionModel } from "@/types/section.type";
import { Dashboard } from "@/components/dashboard/views/Dashboard";
import { prisma } from "@/utils/prisma";
import { Section } from "@/components/dashboard/views/Section";
import { widgetGetData } from "@/utils/serverActions/widget";

export const metadata: Metadata = {
  title: "Dashboard | Home Panel",
  description: "Dashboard - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { dashboardId: string };
}): Promise<JSX.Element | null> {
  console.log("Dashboard:", params);

  /**
   * The dashboard object retrieved from the database.
   * Contains all the sections and widgets associated with the dashboard.
   */
  let dashboard: DashboardModel | null = await prisma.dashboard.findUnique({
    where: {
      id: params.dashboardId,
    },
    include: {
      headerItems: {
        orderBy: { position: "asc" },
      },
      sections: {
        include: {
          widgets: {
            orderBy: { position: "asc" },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!dashboard) return notFound();

  // Fetch data for all widgets
  for (const section of dashboard.sections) {
    for (const widget of section.widgets) {
      widget.data = await widgetGetData(widget.id, widget.type);
    }
  }

  return (
    <Dashboard dashboard={dashboard}>
      {dashboard.sections.map((section: SectionModel) => (
        <Section key={section.id} data={section} />
      ))}
    </Dashboard>
  );
}
