import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { DashboardModel } from "@/types/dashboard.type";
import { Dashboard } from "@/components/dashboard/views/Dashboard";
import { prisma } from "@/utils/prisma";

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
  /**
   * The dashboard object retrieved from the database.
   * Contains all the sections and widgets associated with the dashboard.
   */
  const dashboard: DashboardModel | null = await prisma.dashboard.findUnique({
    where: {
      id: params.dashboardId,
    },
    include: {
      sections: {
        include: {
          widgets: true,
        },
      },
    },
  });

  if (!dashboard) return notFound();

  return <Dashboard dashboard={dashboard} />;
}
