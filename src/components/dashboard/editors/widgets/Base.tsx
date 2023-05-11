"use client";
import type { Widget } from "@prisma/client";
import { TextField } from "@mui/material";

import { widgetUpdate } from "@/utils/widgetActions";

export function EditWidgetBase({ data }: { data: Widget }): JSX.Element {
  return (
    <>
      <TextField
        name="title"
        label="Title"
        margin="dense"
        defaultValue={data.title}
        onChange={async (e) =>
          await widgetUpdate({ ...data, [e.target.name]: e.target.value })
        }
      />
    </>
  );
}
