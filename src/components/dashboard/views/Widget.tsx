"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@mui/material";
// import { useRouter } from "next/router";

import { WidgetBase } from "@/components/dashboard/views/widgets/Base";
import { widgetGetData } from "@/utils/serverActions/widget";
import { WidgetHomeAssistant } from "@/components/dashboard/views/widgets/HomeAssistant";
import { WidgetImage } from "@/components/dashboard/views/widgets/Image";
import { WidgetMarkdown } from "@/components/dashboard/views/widgets/Markdown";
import { WidgetType } from "@/types/widget.type";

export function Widget({
  dashboardId,
  data,
  editing,
}: {
  dashboardId: string;
  data: WidgetModel;
  editing: boolean;
}): JSX.Element {
  const [widgetData, setWidgetData] = useState<any>(null);
  // const router = useRouter();

  useEffect(() => {
    (async () => {
      const newData = await widgetGetData(data.id, data.type);
      setWidgetData(newData);
    })();
  }, [data.id, data.type]);

  function handleInteraction(): void {
    console.log("Handle interaction:", { data, editing });
    if (editing) {
      // router.push(
      //   `/dashboards/${dashboardId}/sections/${data.sectionId}/widgets/${data.id}/edit`
      // );
    } else {
    }
  }

  const widgetView: JSX.Element = useMemo(() => {
    if (!widgetData) return <Skeleton variant="text" />;
    switch (data.type) {
      case WidgetType.HomeAssistant:
        return <WidgetHomeAssistant data={widgetData} />;
      case WidgetType.Image:
        return <WidgetImage data={widgetData} />;
      case WidgetType.Markdown:
        return <WidgetMarkdown data={widgetData} />;
      default:
        return <div>Unknown widget type</div>;
    }
  }, [data.type, widgetData]);

  return (
    <WidgetBase
      data={data}
      editing={editing}
      handleInteraction={(_) => handleInteraction}
    >
      {widgetView}
    </WidgetBase>
  );
}
