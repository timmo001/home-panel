"use client";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  Skeleton,
  Typography,
  Unstable_Grid2 as Grid2,
} from "@mui/material";

import type { SectionModel } from "@/types/section.type";
import type { WidgetModel } from "@/types/widget.type";
import { EditWidgetBase } from "@/components/dashboard/editors/widgets/Base";
import { EditWidgetFrame } from "@/components/dashboard/editors/widgets/Frame";
import { EditWidgetHomeAssistant } from "./widgets/HomeAssistant";
import { EditWidgetImage } from "@/components/dashboard/editors/widgets/Image";
import { EditWidgetMarkdown } from "@/components/dashboard/editors/widgets/Markdown";
import { Section } from "@/components/dashboard/views/Section";
import { WidgetType } from "@/types/widget.type";

export function EditWidget({
  dashboardId,
  section,
}: {
  dashboardId: string;
  section: SectionModel;
}): JSX.Element {
  const widget: WidgetModel = section.widgets[0];
  const { id, data, position, sectionId, title, type, width } = widget;

  const widgetView: JSX.Element = useMemo(() => {
    if (!data) return <Skeleton variant="text" />;
    switch (type) {
      case WidgetType.Frame:
        return (
          <EditWidgetFrame
            dashboardId={dashboardId}
            sectionId={sectionId}
            widgetData={data}
          />
        );
      case WidgetType.HomeAssistant:
        return (
          <EditWidgetHomeAssistant
            dashboardId={dashboardId}
            sectionId={sectionId}
            widgetData={data}
          />
        );
      case WidgetType.Image:
        return (
          <EditWidgetImage
            dashboardId={dashboardId}
            sectionId={sectionId}
            widgetData={data}
          />
        );
      case WidgetType.Markdown:
        return (
          <EditWidgetMarkdown
            dashboardId={dashboardId}
            sectionId={sectionId}
            widgetData={data}
          />
        );
      default:
        return <div>Unknown widget type</div>;
    }
  }, [dashboardId, type, sectionId, data]);

  return (
    <Grid2
      container
      direction="row"
      alignItems="center"
      sx={{
        margin: "2.5rem 2.5rem 0",
        width: "100%",
      }}
      xs
    >
      <Grid2 xs sx={{ height: "100%" }}>
        <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5">Edit Widget</Typography>
            <Grid2 container direction="column" sx={{ marginTop: "1rem" }}>
              <EditWidgetBase dashboardId={dashboardId} widget={widget} />
              {widgetView}
            </Grid2>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 xs>
        {data && (
          <Section
            data={{
              ...section,
              widgets: [
                {
                  id,
                  position,
                  type,
                  title,
                  width,
                  sectionId,
                  data,
                },
              ],
            }}
          />
        )}
      </Grid2>
    </Grid2>
  );
}
