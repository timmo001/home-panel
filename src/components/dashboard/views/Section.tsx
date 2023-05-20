"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import {
  AddRounded,
  ArrowBackRounded,
  ArrowForwardRounded,
  CheckRounded,
  DeleteRounded,
  EditRounded,
} from "@mui/icons-material";
import { Typography, Unstable_Grid2 as Grid2, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SectionAction, SectionModel } from "@/types/section.type";
import { Widget } from "@/components/dashboard/views/Widget";
import Link from "next/link";
import { sectionDelete, sectionUpdate } from "@/utils/serverActions/section";

export function Section({ data }: { data: SectionModel }): JSX.Element {
  const [editing, setEditing] = useState<boolean>(false);
  const router = useRouter();

  async function handleInteraction(action: SectionAction): Promise<void> {
    console.log("Handle interaction:", action);
    switch (action) {
      case SectionAction.Delete:
        console.log("Delete section");
        await sectionDelete(data.dashboardId, data.id);
        break;
      case SectionAction.Edit:
        console.log("Edit section");
        router.push(`/dashboards/${data.dashboardId}/sections/${data.id}/edit`);
        break;
      case SectionAction.MoveDown:
        console.log("Move section down");
        await sectionUpdate(
          data.dashboardId,
          data.id,
          "position",
          data.position + 15
        );
        break;
      case SectionAction.MoveUp:
        console.log("Move section up");
        await sectionUpdate(
          data.dashboardId,
          data.id,
          "position",
          data.position - 15
        );
        break;
    }
  }

  return (
    <>
      <Grid2
        component="section"
        container
        direction="column"
        wrap="nowrap"
        sx={{
          height: "100%",
          margin: "0.5rem 1rem",
          width: data.width,
        }}
      >
        <Grid2
          container
          direction="row"
          xs="auto"
          sx={{
            marginBottom: "0.5rem",
          }}
        >
          {data.title && <Typography variant="h5">{data.title}</Typography>}
          <Grid2
            container
            spacing={2}
            alignContent="center"
            justifyContent={editing ? "space-between" : "flex-end"}
            sx={{
              flexGrow: 1,
              paddingLeft: "1.5rem",
              paddingRight: "0.5rem",
            }}
          >
            {editing && (
              <>
                <IconButton
                  aria-label="Move Section Backward"
                  size="small"
                  onClick={(_) => handleInteraction(SectionAction.MoveUp)}
                >
                  <ArrowBackRounded fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="Move Section Forward"
                  size="small"
                  onClick={(_) => handleInteraction(SectionAction.MoveDown)}
                >
                  <ArrowForwardRounded fontSize="small" />
                </IconButton>
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
        </Grid2>
        <Grid2
          container
          direction="row"
          spacing={2}
          alignContent="flex-start"
          justifyContent="flex-start"
          xs="auto"
          sx={{}}
        >
          {data.widgets.map((widget: WidgetModel) => (
            <Grid2
              key={widget.id}
              xs={
                !widget.width
                  ? 6
                  : !isNaN(Number(widget.width))
                  ? Number(widget.width)
                  : "auto"
              }
              sx={{
                width:
                  widget.width && isNaN(Number(widget.width))
                    ? widget.width
                    : undefined,
              }}
            >
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
                href={`/dashboards/${data.dashboardId}/sections/${data.id}/widgets/new`}
              >
                <IconButton aria-label="Add Widget" size="large">
                  <AddRounded fontSize="large" />
                </IconButton>
              </Link>
            </Grid2>
          )}
        </Grid2>
      </Grid2>
      {editing && (
        <Grid2
          component="section"
          container
          direction="column"
          wrap="nowrap"
          sx={{
            height: "100%",
            margin: "0.5rem 1rem",
          }}
        >
          <Link href={`/dashboards/${data.dashboardId}/sections/new`}>
            <IconButton aria-label="Add Widget" size="large">
              <AddRounded fontSize="large" />
            </IconButton>
          </Link>
        </Grid2>
      )}
    </>
  );
}
