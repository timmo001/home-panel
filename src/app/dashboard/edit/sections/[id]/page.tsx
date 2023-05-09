import type { Metadata } from "next";

import { EditSection } from "@/components/dashboard/editors/Section";

export const metadata: Metadata = {
  title: "Edit Item | Home Panel",
  description: "Edit Item - Home Panel",
};

export const revalidate = 0;

export default async function Page({
  id,
}: {
  id: string;
}): Promise<JSX.Element> {
  return <EditSection />;
}
