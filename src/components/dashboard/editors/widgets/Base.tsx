"use client";
import type { Widget } from "@prisma/client";
import { TextField } from "@mui/material";

import { widgetUpdate } from "@/utils/widgetActions";

export function EditWidgetBase({
  dashboardId,
  data,
}: {
  dashboardId: string;
  data: Widget;
}): JSX.Element {
  return (
    <>
      <TextField
        name="title"
        label="Title"
        margin="dense"
        defaultValue={data.title}
        onChange={async (e) =>
          await widgetUpdate(
            dashboardId,
            data.id,
            e.target.name,
            e.target.value
          )
        }
      />
    </>
  );
}
