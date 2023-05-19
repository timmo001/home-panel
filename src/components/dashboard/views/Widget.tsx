"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import { Skeleton } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { WidgetBase } from "@/components/dashboard/views/widgets/Base";
import {
  widgetDelete,
  widgetGetData,
  widgetUpdate,
} from "@/utils/serverActions/widget";
import { WidgetHomeAssistant } from "@/components/dashboard/views/widgets/HomeAssistant";
import { WidgetImage } from "@/components/dashboard/views/widgets/Image";
import { WidgetMarkdown } from "@/components/dashboard/views/widgets/Markdown";
import { WidgetAction, WidgetType } from "@/types/widget.type";

export function Widget({
  dashboardId,
  data,
  editing,
}: {
  dashboardId: string;
  data: WidgetModel;
  editing: boolean;
}): JSX.Element {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [widgetData, setWidgetData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const newData = await widgetGetData(data.id, data.type);
      setWidgetData(newData);
    })();
  }, [data.id, data.type]);

  async function handleInteraction(action: WidgetAction): Promise<void> {
    console.log("Handle interaction:", action);

    switch (action) {
      case WidgetAction.Delete:
        await widgetDelete(dashboardId, data.id);
        break;
      case WidgetAction.Edit:
        router.push(
          `/dashboards/${dashboardId}/sections/${data.sectionId}/widgets/${data.id}/edit`
        );
        break;
      case WidgetAction.MoveDown:
        await widgetUpdate(
          dashboardId,
          data.id,
          "position",
          data.position + 15
        );
        break;
      case WidgetAction.MoveUp:
        await widgetUpdate(
          dashboardId,
          data.id,
          "position",
          data.position - 15
        );
        break;
      case WidgetAction.ToggleExpanded:
        setExpanded(!expanded);
        break;
    }
  }

  const widgetView: JSX.Element = useMemo(() => {
    if (!widgetData) return <Skeleton variant="text" />;
    switch (data.type) {
      case WidgetType.HomeAssistant:
        return <WidgetHomeAssistant data={widgetData} expanded={expanded} />;
      case WidgetType.Image:
        return <WidgetImage data={widgetData} />;
      case WidgetType.Markdown:
        return <WidgetMarkdown data={widgetData} />;
      default:
        return <div>Unknown widget type</div>;
    }
  }, [data.type, expanded, widgetData]);

  return (
    <WidgetBase
      data={data}
      editing={editing}
      expanded={expanded}
      handleInteraction={handleInteraction}
    >
      {widgetView}
    </WidgetBase>
  );
}
