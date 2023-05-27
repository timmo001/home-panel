"use client";
import { TextField } from "@mui/material";
import { WidgetImage } from "@prisma/client";

import { widgetImageUpdate } from "@/utils/serverActions/widget";

export function EditWidgetImage({
  dashboardId,
  sectionId,
  widgetData,
}: {
  dashboardId: string;
  sectionId: string;
  widgetData: WidgetImage;
}): JSX.Element {
  return (
    <>
      <TextField
        name="url"
        label="Image URL"
        margin="dense"
        defaultValue={widgetData.url}
        onChange={async (e) =>
          await widgetImageUpdate(
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
