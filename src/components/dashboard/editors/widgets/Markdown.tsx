"use client";
import { TextField } from "@mui/material";
import { WidgetMarkdown } from "@prisma/client";

import { widgetUpdate } from "@/utils/widgetActions";

export function EditWidgetMarkdown({
  data,
}: {
  data: WidgetMarkdown;
}): JSX.Element {
  return (
    <>
      <TextField
        name="content"
        label="Content"
        margin="dense"
        defaultValue={data.content}
        // onChange={async (e) =>
        //   await widgetUpdate(
        //     dashboardId,
        //     data.id,
        //     e.target.name,
        //     e.target.value
        //   )
        // }
      />
    </>
  );
}
