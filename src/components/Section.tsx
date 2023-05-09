"use client";
import { Typography, Unstable_Grid2 as Grid } from "@mui/material";

export function Section({
  children,
  title,
}: {
  children: Array<JSX.Element>;
  title: string;
}): JSX.Element {
  return (
    <Grid
      container
      direction="column"
      xs={3}
      sx={{ height: "100%", margin: "1rem" }}
    >
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2} xs="auto">
        {children.map((child, index) => (
          <Grid key={index} xs={6}>
            {child}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
