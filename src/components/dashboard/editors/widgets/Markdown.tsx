"use client";
import { TextField } from "@mui/material";
import { Widget } from "@prisma/client";

import { widgetUpdate } from "@/utils/widgetActions";

export function EditWidgetMarkdown({ data }: { data: Widget }): JSX.Element {
  return (
    <>
      <TextField
        name="content"
        label="Content"
        margin="dense"
        defaultValue={data.content}
        onChange={async (e) =>
          await widgetUpdate({ ...data, [e.target.name]: e.target.value })
        }
      />
    </>
  );
}
