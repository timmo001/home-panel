"use client";
import { TextField } from "@mui/material";
import { WidgetImage } from "@prisma/client";

import { widgetImageUpdate } from "@/utils/serverActions/widget";

export function EditWidgetImage({
  dashboardId,
  sectionId,
  data,
}: {
  dashboardId: string;
  sectionId: string;
  data: WidgetImage;
}): JSX.Element {
  return (
    <>
      <TextField
        name="url"
        label="Image URL"
        margin="dense"
        defaultValue={data.url}
        onChange={async (e) =>
          await widgetImageUpdate(
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
