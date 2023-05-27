"use client";
import type { WidgetChecklistItem as WidgetChecklistItemModel } from "@prisma/client";
import {
  Button,
  Unstable_Grid2 as Grid2,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  DeleteOutlineRounded,
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
  AddRounded,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { WidgetChecklistModel, WidgetModel } from "@/types/widget.type";
import { widgetChecklistUpdate } from "@/utils/serverActions/widget";

function WidgetChecklistItem({
  dashboardId,
  item,
  sectionId,
  handleDeleted,
}: {
  dashboardId: string;
  item: WidgetChecklistItemModel;
  sectionId: string;
  handleDeleted: () => void;
}): JSX.Element {
  const { id, checklistWidgetId, content } = item;
  const [checked, setChecked] = useState<boolean>(item.checked);
  return (
    <Grid2>
      <TextField
        defaultValue={content}
        fullWidth
        margin="dense"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                aria-label="Check item"
                onClick={async () => {
                  setChecked(!checked);
                  await widgetChecklistUpdate(
                    dashboardId,
                    sectionId,
                    checklistWidgetId,
                    id,
                    "checked",
                    !checked
                  );
                }}
                edge="start"
              >
                {checked ? (
                  <CheckBoxRounded />
                ) : (
                  <CheckBoxOutlineBlankRounded />
                )}
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="Delete item"
                onClick={async () => {
                  await widgetChecklistUpdate(
                    dashboardId,
                    sectionId,
                    checklistWidgetId,
                    id,
                    "id",
                    "DELETE"
                  );
                  handleDeleted();
                }}
                edge="end"
              >
                <DeleteOutlineRounded />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onChange={async (e) => {
          await widgetChecklistUpdate(
            dashboardId,
            sectionId,
            checklistWidgetId,
            id,
            "content",
            e.target.value
          );
        }}
      />
    </Grid2>
  );
}

export function WidgetChecklist({
  dashboardId,
  sectionId,
  widget,
}: {
  dashboardId: string;
  sectionId: string;
  widget: WidgetModel<WidgetChecklistModel>;
}): JSX.Element {
  const router = useRouter();
  return (
    <Grid2 container direction="column">
      {widget.data.items.map((item: WidgetChecklistItemModel) => (
        <WidgetChecklistItem
          key={item.id}
          dashboardId={dashboardId}
          item={item}
          sectionId={sectionId}
          handleDeleted={() => {
            // startTransition(() => {
            //   router.refresh();
            // });
          }}
        />
      ))}
      <Grid2>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={async () => {
            await widgetChecklistUpdate(
              dashboardId,
              sectionId,
              widget.id,
              "",
              "content",
              ""
            );
            // startTransition(() => {
            //   router.refresh();
            // });
          }}
        >
          <AddRounded />
          Add item
        </Button>
      </Grid2>
    </Grid2>
  );
}
