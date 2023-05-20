import type { Section } from "@prisma/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditSection } from "@/components/dashboard/editors/Section";
import { prisma } from "@/utils/prisma";

export const metadata: Metadata = {
  title: "Edit Section | Home Panel",
  description: "Edit Section - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { dashboardId: string; sectionId: string };
}): Promise<JSX.Element> {
  console.log("Edit Section:", params);

  let data: Section | null = await prisma.section.findUnique({
    where: {
      id: params.sectionId,
    },
  });

  if (!data) return notFound();

  return <EditSection dashboardId={params.dashboardId} data={data} />;
}
