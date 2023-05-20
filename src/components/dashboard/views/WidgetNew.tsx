"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { widgetCreate } from "@/utils/serverActions/widget";
import { SkeletonDashboard } from "@/components/skeletons/Dashboard";

export function WidgetNew({
  dashboardId,
  sectionId,
}: {
  dashboardId: string;
  sectionId: string;
}): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const newWidget = await widgetCreate(dashboardId, sectionId);
      router.replace(
        `/dashboards/${dashboardId}/sections/${sectionId}/widgets/${newWidget.id}/edit`
      );
    })();
  }, [dashboardId, router, sectionId]);

  return <SkeletonDashboard />;
}
