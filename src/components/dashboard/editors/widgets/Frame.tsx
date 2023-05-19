"use client";
import { TextField } from "@mui/material";
import { WidgetFrame } from "@prisma/client";

import { widgetFrameUpdate } from "@/utils/serverActions/widget";

export function EditWidgetFrame({
  dashboardId,
  sectionId,
  data,
}: {
  dashboardId: string;
  sectionId: string;
  data: WidgetFrame;
}): JSX.Element {
  return (
    <>
      <TextField
        name="url"
        label="URL"
        margin="dense"
        defaultValue={data.url || ""}
        onChange={async (e) =>
          await widgetFrameUpdate(
            dashboardId,
            sectionId,
            data.widgetId,
            e.target.name,
            e.target.value
          )
        }
      />
      <TextField
        name="height"
        label="Height"
        margin="dense"
        defaultValue={data.height || ""}
        onChange={async (e) =>
          await widgetFrameUpdate(
            dashboardId,
            sectionId,
            data.widgetId,
            e.target.name,
            e.target.value
          )
        }
      />
    </>
  );
}
