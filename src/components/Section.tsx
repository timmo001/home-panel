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
    <Grid>
      <Typography variant="h5">{title}</Typography>
      <Grid container spacing={2}>
        {children.map((child, index) => (
          <Grid key={index}>{child}</Grid>
        ))}
      </Grid>
    </Grid>
  );
}
