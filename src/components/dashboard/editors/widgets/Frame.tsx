"use client";
import { TextField } from "@mui/material";
import { WidgetFrame } from "@prisma/client";

import { widgetFrameUpdate } from "@/utils/serverActions/widget";

export function EditWidgetFrame({
  dashboardId,
  sectionId,
  widgetData,
}: {
  dashboardId: string;
  sectionId: string;
  widgetData: WidgetFrame;
}): JSX.Element {
  return (
    <>
      <TextField
        name="url"
        label="URL"
        margin="dense"
        defaultValue={widgetData.url || ""}
        onChange={async (e) =>
          await widgetFrameUpdate(
            dashboardId,
            sectionId,
            widgetData.widgetId,
            e.target.name,
            e.target.value
          )
        }
      />
      <TextField
        name="height"
        label="Height"
        margin="dense"
        defaultValue={widgetData.height || ""}
        onChange={async (e) =>
          await widgetFrameUpdate(
            dashboardId,
            sectionId,
            widgetData.widgetId,
            e.target.name,
            e.target.value
          )
        }
      />
    </>
  );
}
