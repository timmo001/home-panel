"use client";
import type { Section as SectionModel } from "@prisma/client";
import {
  Typography,
  Card,
  CardContent,
  Unstable_Grid2 as Grid2,
  TextField,
} from "@mui/material";

import { Section } from "@/components/dashboard/views/Section";
import { sectionUpdate } from "@/utils/serverActions/section";

export function EditSection({
  dashboardId,
  data,
}: {
  dashboardId: string;
  data: SectionModel;
}): JSX.Element {
  return (
    <Grid2
      container
      direction="row"
      alignItems="center"
      sx={{
        margin: "2.5rem 2.5rem 0",
        width: "100%",
      }}
      xs
    >
      <Grid2 xs sx={{ height: "100%" }}>
        <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5">Edit Section</Typography>
            <Grid2 container direction="column" sx={{ marginTop: "1rem" }}>
              <TextField
                name="title"
                label="Title"
                margin="dense"
                defaultValue={data.title}
                onChange={async (e) =>
                  await sectionUpdate(
                    dashboardId,
                    data.id,
                    e.target.name,
                    e.target.value
                  )
                }
              />
              <TextField
                name="subtitle"
                label="Subtitle"
                margin="dense"
                defaultValue={data.subtitle}
                onChange={async (e) =>
                  await sectionUpdate(
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
                defaultValue={data.width}
                onChange={async (e) =>
                  await sectionUpdate(
                    dashboardId,
                    data.id,
                    e.target.name,
                    e.target.value
                  )
                }
              />
            </Grid2>
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 xs>
        <Section data={{ ...data, widgets: [] }} />
      </Grid2>
    </Grid2>
  );
}
