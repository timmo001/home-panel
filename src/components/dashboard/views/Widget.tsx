"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@mui/material";

import { WidgetBase } from "@/components/dashboard/views/widgets/Base";
import { widgetGetData } from "@/utils/serverActions/widget";
import { WidgetHomeAssistant } from "@/components/dashboard/views/widgets/HomeAssistant";
import { WidgetMarkdown } from "@/components/dashboard/views/widgets/Markdown";
import { WidgetType } from "@/types/widget.type";

export function Widget({
  dashboardId,
  data,
}: {
  dashboardId: string;
  data: WidgetModel;
}): JSX.Element {
  const [widgetData, setWidgetData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const newData = await widgetGetData(data.id, data.type);
      setWidgetData(newData);
    })();
  }, [data.id, data.type]);

  const widgetView: JSX.Element = useMemo(() => {
    if (!widgetData) return <Skeleton variant="text" />;
    switch (data.type) {
      case WidgetType.HomeAssistant:
        return <WidgetHomeAssistant data={widgetData} />;
      case WidgetType.Markdown:
        return <WidgetMarkdown data={widgetData} />;
      default:
        return <div>Unknown widget type</div>;
    }
  }, [data.type, widgetData]);

  return (
    <WidgetBase
      dashboardId={dashboardId}
      sectionId={data.sectionId}
      widgetId={data.id}
      title={data.title}
    >
      {widgetView}
    </WidgetBase>
  );
}
