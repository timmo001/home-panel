"use client";
import type { Widget } from "@prisma/client";
import { Autocomplete, TextField } from "@mui/material";

import { widgetUpdate } from "@/utils/serverActions/widget";
import { WidgetType } from "@/types/widget.type";

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
        defaultValue={data.title || ""}
        onChange={async (e) =>
          await widgetUpdate(
            dashboardId,
            data.id,
            e.target.name,
            e.target.value
          )
        }
      />
      <TextField
        name="width"
        label="Width"
        margin="dense"
        defaultValue={data.width || ""}
        onChange={async (e) =>
          await widgetUpdate(
            dashboardId,
            data.id,
            e.target.name,
            e.target.value
          )
        }
      />
      <Autocomplete
        defaultValue={data.type}
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
          await widgetUpdate(dashboardId, data.id, "type", value);
        }}
      />
    </>
  );
}
