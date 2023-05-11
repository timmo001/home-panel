"use client";
import type { Section as SectionModel } from "@prisma/client";
import { Typography, Unstable_Grid2 as Grid2 } from "@mui/material";

export function Section({
  children,
  data,
}: {
  children: Array<JSX.Element>;
  data: SectionModel;
}): JSX.Element {
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
        {children.map((child, index) => (
          <Grid2 key={index} xs={6}>
            {child}
          </Grid2>
        ))}
      </Grid2>
    </Grid2>
  );
}
