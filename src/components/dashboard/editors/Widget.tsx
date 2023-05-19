"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Skeleton,
  Typography,
  Unstable_Grid2 as Grid2,
} from "@mui/material";

import type { WidgetWithSectionModel } from "@/types/widget.type";
import { EditWidgetBase } from "@/components/dashboard/editors/widgets/Base";
import { EditWidgetFrame } from "@/components/dashboard/editors/widgets/Frame";
import { EditWidgetHomeAssistant } from "./widgets/HomeAssistant";
import { EditWidgetImage } from "@/components/dashboard/editors/widgets/Image";
import { EditWidgetMarkdown } from "@/components/dashboard/editors/widgets/Markdown";
import { Section } from "@/components/dashboard/views/Section";
import { widgetGetData } from "@/utils/serverActions/widget";
import { WidgetType } from "@/types/widget.type";

export function EditWidget({
  dashboardId,
  data,
}: {
  dashboardId: string;
  data: WidgetWithSectionModel;
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
      case WidgetType.Frame:
        return (
          <EditWidgetFrame
            dashboardId={dashboardId}
            sectionId={data.sectionId}
            data={widgetData}
          />
        );
      case WidgetType.HomeAssistant:
        return (
          <EditWidgetHomeAssistant
            dashboardId={dashboardId}
            sectionId={data.sectionId}
            data={widgetData}
          />
        );
      case WidgetType.Image:
        return (
          <EditWidgetImage
            dashboardId={dashboardId}
            sectionId={data.sectionId}
            data={widgetData}
          />
        );
      case WidgetType.Markdown:
        return (
          <EditWidgetMarkdown
            dashboardId={dashboardId}
            sectionId={data.sectionId}
            data={widgetData}
          />
        );
      default:
        return <div>Unknown widget type</div>;
    }
  }, [dashboardId, data.type, data.sectionId, widgetData]);

  return (
    <Grid2
      container
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ width: "100%" }}
      xs
    >
      <Grid2 xs sx={{ height: "100%" }}>
        <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5">Edit Widget</Typography>
            <Grid2 container direction="column" sx={{ marginTop: "1rem" }}>
              <EditWidgetBase dashboardId={dashboardId} data={data} />
              {widgetView}
            </Grid2>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 xs>
        <Section data={{ ...data.section, widgets: [data] }} />
      </Grid2>
    </Grid2>
  );
}
