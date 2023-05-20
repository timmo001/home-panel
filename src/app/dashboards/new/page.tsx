import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";

import { AccessDenied } from "@/components/AccessDenied";
import { DashboardNew } from "@/components/dashboard/new/Dashboard";
import { authOptions } from "@/utils/prisma";

export const metadata: Metadata = {
  title: "New Dashboard | Home Panel",
  description: "New Dashboard - Home Panel",
};

export const revalidate = false;

export default async function Page(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (!session) return <AccessDenied />;
  return <DashboardNew />;
}
