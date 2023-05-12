import type {
  Dashboard as DashboardModel,
  HomeAssistant as HomeAssistantModel,
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

  let dashboardConfig: DashboardModel | null =
    await prisma.dashboard.findUnique({
      where: {
        id: params.dashboardId,
      },
    });

  if (!dashboardConfig) {
    dashboardConfig = await prisma.dashboard.create({
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

  let homeAssistantConfig: HomeAssistantModel | null =
    await prisma.homeAssistant.findUnique({
      where: {
        dashboardId: params.dashboardId,
      },
    });

  if (!homeAssistantConfig)
    homeAssistantConfig = await prisma.homeAssistant.create({
      data: {
        dashboard: {
          connect: {
            id: params.dashboardId,
          },
        },
        url: "http://homeassistant.local:8123",
      },
    });

  return (
    <EditDashboard
      dashboardConfig={dashboardConfig}
      homeAssistantConfig={homeAssistantConfig}
    />
  );
}
