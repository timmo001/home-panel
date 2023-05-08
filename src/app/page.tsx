import type { Metadata } from "next";

import { Dashboard } from "@/components/Dashboard";
import styles from "@/app/page.module.css";

export const metadata: Metadata = {
  title: "Dashboard | Home Panel",
  description: "Dashboard - Home Panel",
};

export const revalidate = 0;

export default async function Page(): Promise<JSX.Element> {
  return (
    <main className={styles.main}>
      <Dashboard />
    </main>
  );
}
