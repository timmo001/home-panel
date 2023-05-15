"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import {
  AddRounded,
  CheckRounded,
  DeleteRounded,
  EditRounded,
} from "@mui/icons-material";
import { Typography, Unstable_Grid2 as Grid2, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SectionAction, SectionModel } from "@/types/section.type";
import { Widget } from "@/components/dashboard/views/Widget";
import { WidgetAction } from "@/types/widget.type";
import Link from "next/link";

export function Section({ data }: { data: SectionModel }): JSX.Element {
  const [editing, setEditing] = useState<boolean>(false);
  const router = useRouter();

  function handleInteraction(action: SectionAction): void {
    console.log("Handle interaction:", action);
    switch (action) {
      case SectionAction.Delete:
        console.log("Delete section");
        break;
      case SectionAction.Edit:
        console.log("Edit section");
        router.push(`/dashboards/${data.dashboardId}/sections/${data.id}/edit`);
        break;
      case SectionAction.MoveDown:
        console.log("Move section down");
        break;
      case SectionAction.MoveUp:
        console.log("Move section up");
        break;
    }
  }

  return (
    <Grid2
      component="section"
      container
      direction="column"
      sx={{
        height: "100%",
        margin: "0.5rem 1rem",
        width: data.width,
      }}
    >
      <Grid2 container xs="auto" sx={{ marginBottom: "0.5rem" }}>
        {data.title && <Typography variant="h5">{data.title}</Typography>}
        <Grid2
          container
          spacing={2}
          alignContent="center"
          justifyContent="space-around"
          sx={{ flexGrow: 1 }}
        >
          {editing && (
            <>
              <IconButton
                aria-label="Edit Section"
                size="small"
                onClick={(_) => handleInteraction(SectionAction.Edit)}
              >
                <EditRounded fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="Delete Widget"
                size="small"
                onClick={(_) => handleInteraction(SectionAction.Delete)}
              >
                <DeleteRounded fontSize="small" />
              </IconButton>
            </>
          )}
        </Grid2>
        <IconButton
          aria-label="Edit"
          size="small"
          onClick={() => setEditing(!editing)}
        >
          {editing ? (
            <CheckRounded fontSize="small" />
          ) : (
            <EditRounded fontSize="small" />
          )}
        </IconButton>
      </Grid2>
      <Grid2 container spacing={2} xs="auto">
        {data.widgets.map((widget: WidgetModel) => (
          <Grid2 key={widget.id} xs={6}>
            <Widget
              dashboardId={data.dashboardId}
              data={widget}
              editing={editing}
            />
          </Grid2>
        ))}
        {editing && (
          <Grid2 xs={6}>
            <Link
              href={`/dashboards/${data.dashboardId}/sections/${data.id}/widgets/0/edit`}
            >
              <IconButton aria-label="Add Widget" size="large">
                <AddRounded fontSize="large" />
              </IconButton>
            </Link>
          </Grid2>
        )}
      </Grid2>
    </Grid2>
  );
}
