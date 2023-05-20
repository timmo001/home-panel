import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";

import { AccessDenied } from "@/components/AccessDenied";
import { authOptions } from "@/utils/prisma";
import { WidgetNew } from "@/components/dashboard/views/WidgetNew";

export const metadata: Metadata = {
  title: "New Widget | Home Panel",
  description: "New Widget - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { dashboardId: string; sectionId: string };
}): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (!session) return <AccessDenied />;
  return (
    <WidgetNew dashboardId={params.dashboardId} sectionId={params.sectionId} />
  );
}
