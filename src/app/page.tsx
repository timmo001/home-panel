import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Dashboard } from "@/components/Dashboard";
import styles from "@/app/page.module.css";

export const metadata: Metadata = {
  title: "Dashboard | Home Panel",
  description: "Dashboard - Home Panel",
};

export const revalidate = 0;

export default async function Page() {
  const session = await getServerSession();

  if (!session) redirect("/api/auth/signin");

  return (
    <main className={styles.main}>
      <Dashboard />
    </main>
  );
}
