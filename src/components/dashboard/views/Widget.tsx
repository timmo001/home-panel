"use client";
import { Skeleton } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { WidgetModel } from "@/types/widget.type";
import { WidgetAction, WidgetType } from "@/types/widget.type";
import { WidgetBase } from "@/components/dashboard/views/widgets/Base";
import { WidgetChecklist } from "@/components/dashboard/views/widgets/Checklist";
import { widgetDelete, widgetUpdate } from "@/utils/serverActions/widget";
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
  const { id, position, sectionId, type } = data;
  const [expanded, setExpanded] = useState<boolean>(false);
  const router = useRouter();

  const handleInteraction = useCallback(
    async (action: WidgetAction): Promise<void> => {
      console.log("Handle interaction:", action);

      switch (action) {
        case WidgetAction.Delete:
          await widgetDelete(dashboardId, id);
          break;
        case WidgetAction.Edit:
          router.push(
            `/dashboards/${dashboardId}/sections/${sectionId}/widgets/${id}/edit`
          );
          break;
        case WidgetAction.MoveDown:
          await widgetUpdate(dashboardId, id, "position", position + 15);
          break;
        case WidgetAction.MoveUp:
          await widgetUpdate(dashboardId, id, "position", position - 15);
          break;
        case WidgetAction.ToggleExpanded:
          setExpanded(!expanded);
          break;
      }
    },
    [dashboardId, id, position, sectionId, expanded, router]
  );

  const widgetView: JSX.Element = useMemo(() => {
    if (!data) return <Skeleton variant="text" />;
    switch (type) {
      case WidgetType.Checklist:
        return (
          <WidgetChecklist
            dashboardId={dashboardId}
            sectionId={sectionId}
            widget={data}
          />
        );
      case WidgetType.Frame:
        return <WidgetFrame widget={data} />;
      case WidgetType.HomeAssistant:
        return (
          <WidgetHomeAssistant
            editing={editing}
            expanded={expanded}
            widget={data}
            handleInteraction={handleInteraction}
          />
        );
      case WidgetType.Image:
        return (
          <WidgetImage
            editing={editing}
            widget={data}
            handleInteraction={handleInteraction}
          />
        );
      case WidgetType.Markdown:
        return <WidgetMarkdown widget={data} />;
      default:
        return <div>Unknown widget type</div>;
    }
  }, [
    dashboardId,
    data,
    editing,
    expanded,
    handleInteraction,
    sectionId,
    type,
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
