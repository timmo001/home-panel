"use client";
import type { Widget } from "@prisma/client";
import { Autocomplete, TextField } from "@mui/material";

import { widgetUpdate } from "@/utils/serverActions/widget";
import { WidgetType } from "@/types/widget.type";

export function EditWidgetBase({
  dashboardId,
  widget,
}: {
  dashboardId: string;
  widget: Widget;
}): JSX.Element {
  const { id, title, type, width } = widget;
  return (
    <>
      <TextField
        name="title"
        label="Title"
        margin="dense"
        defaultValue={title || ""}
        onChange={async (e) =>
          await widgetUpdate(dashboardId, id, e.target.name, e.target.value)
        }
      />
      <TextField
        name="width"
        label="Width"
        margin="dense"
        defaultValue={width || ""}
        onChange={async (e) =>
          await widgetUpdate(dashboardId, id, e.target.name, e.target.value)
        }
      />
      <Autocomplete
        defaultValue={type}
        options={Object.values(WidgetType)}
        getOptionLabel={(option) => {
          // Split camelCase to words and capitalize first letter
          return option
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            name="type"
            label="Type"
            margin="dense"
            required
          />
        )}
        onChange={async (_, value: string | null) => {
          if (!value) return;
          await widgetUpdate(dashboardId, id, "type", value);
        }}
      />
    </>
  );
}
