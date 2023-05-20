"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { dashboardCreate } from "@/utils/serverActions/dashboard";
import { SkeletonDashboard } from "@/components/skeletons/Dashboard";

export function DashboardNew(): JSX.Element {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const newDashboard = await dashboardCreate(session.data!.user!.email!);
      router.replace(`/dashboards/${newDashboard.id}/edit`);
    })();
  }, [router, session.data]);

  return <SkeletonDashboard />;
}
