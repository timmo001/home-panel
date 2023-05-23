"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import { Skeleton } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { WidgetBase } from "@/components/dashboard/views/widgets/Base";
import {
  widgetDelete,
  widgetGetData,
  widgetUpdate,
} from "@/utils/serverActions/widget";
import { WidgetAction, WidgetType } from "@/types/widget.type";
import { WidgetChecklist } from "@/components/dashboard/views/widgets/Checklist";
import { WidgetFrame } from "@/components/dashboard/views/widgets/Frame";
import { WidgetHomeAssistant } from "@/components/dashboard/views/widgets/HomeAssistant";
import { WidgetImage } from "@/components/dashboard/views/widgets/Image";
import { WidgetMarkdown } from "@/components/dashboard/views/widgets/Markdown";

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

  const handleInteraction = useCallback(
    async (action: WidgetAction): Promise<void> => {
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
    },
    [dashboardId, data.id, data.position, data.sectionId, expanded, router]
  );

  const widgetView: JSX.Element = useMemo(() => {
    if (!widgetData) return <Skeleton variant="text" />;
    switch (data.type) {
      case WidgetType.Checklist:
        return (
          <WidgetChecklist
            dashboardId={dashboardId}
            data={widgetData}
            sectionId={data.sectionId}
          />
        );
      case WidgetType.Frame:
        return <WidgetFrame data={widgetData} />;
      case WidgetType.HomeAssistant:
        return (
          <WidgetHomeAssistant
            data={widgetData}
            editing={editing}
            expanded={expanded}
            handleInteraction={handleInteraction}
          />
        );
      case WidgetType.Image:
        return (
          <WidgetImage
            data={widgetData}
            editing={editing}
            handleInteraction={handleInteraction}
          />
        );
      case WidgetType.Markdown:
        return <WidgetMarkdown data={widgetData} />;
      default:
        return <div>Unknown widget type</div>;
    }
  }, [
    dashboardId,
    data.sectionId,
    data.type,
    editing,
    expanded,
    handleInteraction,
    widgetData,
  ]);

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
