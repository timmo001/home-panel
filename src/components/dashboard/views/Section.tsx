"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import { Typography, Unstable_Grid2 as Grid2 } from "@mui/material";

import type { SectionModel } from "@/types/section.type";
import { Widget } from "@/components/dashboard/views/Widget";

export function Section({ data }: { data: SectionModel }): JSX.Element {

  return (
    <Grid2
      component="section"
      container
      direction="column"
      sx={{ height: "100%", width: data.width, margin: "0.5rem 1rem" }}
    >
      {data.title && (
        <Typography variant="h5" gutterBottom>
          {data.title}
        </Typography>
      )}
      <Grid2 container spacing={2} xs="auto">
        {data.widgets.map((widget: WidgetModel) => (
          <Grid2 key={widget.id} xs={6}>
            <Widget dashboardId={data.dashboardId} data={widget} />
          </Grid2>
        ))}
      </Grid2>
    </Grid2>
  );
}
