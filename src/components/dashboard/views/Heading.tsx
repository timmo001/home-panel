"use client";
import { Unstable_Grid2 as Grid2, Typography } from "@mui/material";

import type { DashboardModel } from "@/types/dashboard.type";

export function Heading({
  dashboard,
}: {
  dashboard: DashboardModel;
}): JSX.Element {
  return (
    <Grid2
      component="header"
      container
      justifyContent="space-evenly"
      spacing={1}
      wrap="nowrap"
      xs
      sx={{
        width: "100%",
      }}
    >
      <Grid2>
        <Typography variant="h2">{dashboard.name}</Typography>
      </Grid2>
      <Grid2>
        <Typography variant="h2">{dashboard.name}</Typography>
      </Grid2>
      <Grid2>
        <Typography variant="h2">{dashboard.name}</Typography>
      </Grid2>
    </Grid2>
  );
}
