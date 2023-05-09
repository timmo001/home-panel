import type { Metadata } from "next";

import { Dashboard } from "@/views/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Home Panel",
  description: "Dashboard - Home Panel",
};

export const revalidate = 0;

export default async function Page(): Promise<JSX.Element> {
  return <Dashboard />;
}
