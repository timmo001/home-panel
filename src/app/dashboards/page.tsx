import type {
  Dashboard as DashboardModel,
  User as UserModel,
} from "@prisma/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { AccessDenied } from "@/components/AccessDenied";
import { prisma } from "@/utils/prisma";
import { WidgetType } from "@/types/widget.type";

export const metadata: Metadata = {
  title: "Dashboards | Home Panel",
  description: "Dashboards - Home Panel",
};

export const revalidate = 0;

export default async function Page(): Promise<JSX.Element> {
  const session = await getServerSession();
  if (!session) return <AccessDenied />;

  const user: UserModel = await prisma.user.findUniqueOrThrow({
    where: {
      username: session.user!.email!,
    },
  });

  let dashboard: DashboardModel | null = await prisma.dashboard.findFirst();
  if (!dashboard) {
    console.log("Creating default dashboard..");
    dashboard = await prisma.dashboard.create({
      data: {
        name: "Default",
        description: "Default dashboard",
        sections: {
          create: [
            {
              title: "Example",
              subtitle: "Example section",
              width: "480px",
              widgets: {
                create: [
                  {
                    title: "Example",
                    type: WidgetType.Markdown,
                    markdown: {
                      create: {
                        content: "Example widget",
                      },
                    },
                  },
                ],
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
    revalidatePath(`/dashboards/${dashboard.id}`);
  }

  return redirect(`/dashboards/${dashboard.id}`);
}
