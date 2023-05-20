import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";

import { AccessDenied } from "@/components/AccessDenied";
import { authOptions } from "@/utils/prisma";
import { SectionNew } from "@/components/dashboard/views/SectionNew";

export const metadata: Metadata = {
  title: "New Section | Home Panel",
  description: "New Section - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { dashboardId: string };
}): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (!session) return <AccessDenied />;
  return <SectionNew dashboardId={params.dashboardId} />;
}
