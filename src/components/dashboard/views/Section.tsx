"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import { useState } from "react";
import { Typography, Unstable_Grid2 as Grid2, IconButton } from "@mui/material";

import type { SectionModel } from "@/types/section.type";
import { Widget } from "@/components/dashboard/views/Widget";
import { CheckRounded, EditRounded } from "@mui/icons-material";

export function Section({ data }: { data: SectionModel }): JSX.Element {
  const [editSection, setEditSection] = useState<boolean>(false);

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
        {data.title && (
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            {data.title}
          </Typography>
        )}
        <IconButton
          aria-label="Edit Section"
          size="small"
          onClick={() => setEditSection(!editSection)}
        >
          {editSection ? (
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
              editing={editSection}
            />
          </Grid2>
        ))}
      </Grid2>
    </Grid2>
  );
}
