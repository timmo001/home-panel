import type { Widget } from "@prisma/client";
import type { Metadata } from "next";

import { EditWidget } from "@/components/dashboard/editors/Widget";
import { widgetCreate, widgetGet } from "@/utils/widgetActions";

export const metadata: Metadata = {
  title: "Edit Item | Home Panel",
  description: "Edit Item - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const data: Widget | null = await widgetGet(id);

  if (!data) {
    await widgetCreate({
    });
    return <div>404</div>;
  }

  return <EditWidget data={data} />;
}
