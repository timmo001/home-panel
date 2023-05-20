import type { User as UserModel } from "@prisma/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/AccessDenied";
import { dashboardCreate } from "@/utils/serverActions/dashboard";
import { prisma } from "@/utils/prisma";

export const metadata: Metadata = {
  title: "New Dashboard | Home Panel",
  description: "New Dashboard - Home Panel",
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

  console.log("New Dashboard:", { userId: user.id });

  const newDashboard = await dashboardCreate(user.id);

  return redirect(`/dashboards/${newDashboard.id}/edit`);
}
