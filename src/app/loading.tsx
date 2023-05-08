import { SkeletonDashboard } from "@/components/skeletons/Dashboard";
import styles from "@/app/page.module.css";

export default async function Loading() {
  return (
    <main className={styles.main}>
      <SkeletonDashboard />
    </main>
  );
}
