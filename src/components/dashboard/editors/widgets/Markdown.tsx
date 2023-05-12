"use client";
import { TextField } from "@mui/material";
import { WidgetMarkdown } from "@prisma/client";

import { widgetMarkdownUpdate } from "@/utils/widgetActions";

export function EditWidgetMarkdown({
  dashboardId,
  sectionId,
  data,
}: {
  dashboardId: string;
  sectionId: string;
  data: WidgetMarkdown;
}): JSX.Element {
  return (
    <>
      <TextField
        name="content"
        label="Content"
        margin="dense"
        defaultValue={data.content}
        onChange={async (e) =>
          await widgetMarkdownUpdate(
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
