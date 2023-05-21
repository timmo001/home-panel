"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { sectionCreate } from "@/utils/serverActions/section";
import { SkeletonDashboard } from "@/components/skeletons/Dashboard";

export function SectionNew({
  dashboardId,
}: {
  dashboardId: string;
}): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const newSection = await sectionCreate(dashboardId);
      router.replace(`/dashboards/${dashboardId}/sections/${newSection.id}/edit`);
    })();
  }, [dashboardId, router]);

  return <SkeletonDashboard />;
}
