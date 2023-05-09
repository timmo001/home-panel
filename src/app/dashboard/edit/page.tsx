import type { Metadata } from "next";

import { EditDashboard } from "@/editors/EditDashboard";

export const metadata: Metadata = {
  title: "Edit Dashboard | Home Panel",
  description: "Edit Dashboard - Home Panel",
};

export const revalidate = 0;

export default async function Page(): Promise<JSX.Element> {
  return <EditDashboard />;
}
