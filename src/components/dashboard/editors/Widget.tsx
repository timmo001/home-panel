"use client";
import type { Widget } from "@prisma/client";
import {
  Card,
  CardContent,
  Typography,
  Unstable_Grid2 as Grid2,
} from "@mui/material";

import { EditWidgetBase } from "@/components/dashboard/editors/widgets/Base";
import { EditWidgetMarkdown } from "@/components/dashboard/editors/widgets/Markdown";
import { Widget } from "@/components/dashboard/views/Widget";
import { Section } from "@/components/dashboard/views/Section";

export function EditWidget({ data }: { data: Widget }): JSX.Element {
  return (
    <Grid2
      container
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ width: "100%" }}
      xs
    >
      <Grid2 xs sx={{ height: "100%" }}>
        <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5">Edit Item</Typography>
            <Grid2 container direction="column" sx={{ marginTop: "1rem" }}>
              <EditWidgetBase data={data} />
              <EditWidgetMarkdown data={data} />
            </Grid2>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 xs>
        <Section>{[<Widget key={0} data={data} />]}</Section>
      </Grid2>
    </Grid2>
  );
}
