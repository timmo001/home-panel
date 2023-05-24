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
import { useState, useTransition } from "react";

import { WidgetChecklistModel } from "@/types/widget.type";
import { widgetChecklistUpdate } from "@/utils/serverActions/widget";

function WidgetChecklistItem({
  dashboardId,
  data,
  sectionId,
  handleDeleted,
}: {
  dashboardId: string;
  data: WidgetChecklistItemModel;
  sectionId: string;
  handleDeleted: () => void;
}): JSX.Element {
  const { id, checklistWidgetId, content } = data;
  const [checked, setChecked] = useState<boolean>(data.checked);
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
  data,
  sectionId,
}: {
  dashboardId: string;
  data: WidgetChecklistModel;
  sectionId: string;
}): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Grid2 container direction="column">
      {isPending ? (
        <></>
      ) : (
        data.items.map((item: WidgetChecklistItemModel) => (
          <WidgetChecklistItem
            key={item.id}
            dashboardId={dashboardId}
            data={item}
            sectionId={sectionId}
            handleDeleted={() => {
              startTransition(() => {
                router.refresh();
              });
            }}
          />
        ))
      )}
      <Grid2>
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={async () => {
            await widgetChecklistUpdate(
              dashboardId,
              sectionId,
              data.widgetId,
              "",
              "content",
              ""
            );
            startTransition(() => {
              router.refresh();
            });
          }}
        >
          <AddRounded />
          Add item
        </Button>
      </Grid2>
    </Grid2>
  );
}
