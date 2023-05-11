import type { Dashboard } from "@prisma/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/AccessDenied";
import { prisma } from "@/utils/prisma";

export const metadata: Metadata = {
  title: "Dashboards | Home Panel",
  description: "Dashboards - Home Panel",
};

export const revalidate = 0;

export default async function Page(): Promise<JSX.Element> {
  const session = await getServerSession();
  if (!session) return <AccessDenied />;

  let dashboard: Dashboard | null = await prisma.dashboard.findFirst();
  if (!dashboard)
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
                    type: "markdown",
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
            id: session.user!.email!,
          },
        },
      },
    });

  return redirect(`/dashboards/${dashboard.id}`);
}
