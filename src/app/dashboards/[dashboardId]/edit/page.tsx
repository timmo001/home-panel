import type {
  Dashboard as DashboardModel,
  HeaderItem as HeaderItemModel,
  HomeAssistant as HomeAssistantModel,
  User as UserModel,
} from "@prisma/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/AccessDenied";
import { EditDashboard } from "@/components/dashboard/editors/Dashboard";
import { prisma } from "@/utils/prisma";
import { DashboardHeaderItemType } from "@/types/dashboard.type";

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
  console.log("Edit Dashboard:", params);

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

  const headerItemsConfig: Array<HeaderItemModel> =
    await prisma.headerItem.findMany({
      where: {
        dashboardId: params.dashboardId,
      },
    });

  if (headerItemsConfig.length === 0) {
    headerItemsConfig.push(
      await prisma.headerItem.create({
        data: {
          dashboard: {
            connect: {
              id: params.dashboardId,
            },
          },
          type: DashboardHeaderItemType.Spacer,
          position: 0,
        },
      })
    );
    headerItemsConfig.push(
      await prisma.headerItem.create({
        data: {
          dashboard: {
            connect: {
              id: params.dashboardId,
            },
          },
          type: DashboardHeaderItemType.DateTime,
          position: 10,
        },
      })
    );
    headerItemsConfig.push(
      await prisma.headerItem.create({
        data: {
          dashboard: {
            connect: {
              id: params.dashboardId,
            },
          },
          type: DashboardHeaderItemType.Spacer,
          position: 20,
        },
      })
    );
  }

  return (
    <EditDashboard
      dashboardConfig={dashboardConfig}
      headerItemsConfig={headerItemsConfig}
      homeAssistantConfig={homeAssistantConfig}
    />
  );
}
