import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/AccessDenied";
import { widgetCreate } from "@/utils/serverActions/widget";

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
  console.log("New Widget:", params);

  const session = await getServerSession();
  if (!session) return <AccessDenied />;

  const newWidget = await widgetCreate(params.dashboardId, params.sectionId);

  return redirect(
    `/dashboards/${params.dashboardId}/sections/${params.sectionId}/widgets/${newWidget.id}/edit`
  );
}
