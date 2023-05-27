"use client";
import { TextField } from "@mui/material";
import { WidgetMarkdown } from "@prisma/client";

import { widgetMarkdownUpdate } from "@/utils/serverActions/widget";

export function EditWidgetMarkdown({
  dashboardId,
  sectionId,
  widgetData,
}: {
  dashboardId: string;
  sectionId: string;
  widgetData: WidgetMarkdown;
}): JSX.Element {
  return (
    <>
      <TextField
        name="content"
        label="Content"
        margin="dense"
        defaultValue={widgetData.content}
        onChange={async (e) =>
          await widgetMarkdownUpdate(
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
