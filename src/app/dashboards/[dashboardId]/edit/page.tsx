import type {
  Dashboard as DashboardModel,
  User as UserModel,
} from "@prisma/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/AccessDenied";
import { EditDashboard } from "@/components/dashboard/editors/Dashboard";
import { prisma } from "@/utils/prisma";

export const metadata: Metadata = {
  title: "Edit Dashboard | Home Panel",
  description: "Edit Dashboard - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { dashboardId: string };
}): Promise<JSX.Element> {
  const session = await getServerSession();
  if (!session) return <AccessDenied />;

  const user: UserModel = await prisma.user.findUniqueOrThrow({
    where: {
      username: session.user!.email!,
    },
  });

  let data: DashboardModel | null = await prisma.dashboard.findUnique({
    where: {
      id: params.dashboardId,
    },
  });

  if (!data) {
    data = await prisma.dashboard.create({
      data: {
        name: "Dashboard",
        description: "New dashboard",
        sections: {
          create: [
            {
              title: "Section 01",
              subtitle: "Example section",
              width: "480px",
              widgets: {
                create: [],
              },
            },
          ],
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    redirect(`/dashboards/${params.dashboardId}/edit`);
  }

  return <EditDashboard data={data} />;
}
