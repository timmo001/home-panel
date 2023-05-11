"use client";
import { Typography, Unstable_Grid2 as Grid2, IconButton } from "@mui/material";
import { EditRounded } from "@mui/icons-material";
import Link from "next/link";

export function EditSection({
  children,
  dashboardId,
  sectionId,
  title,
}: {
  children: Array<JSX.Element>;
  dashboardId: string;
  sectionId: string;
  title?: string;
}): JSX.Element {
  return (
    <Grid2
      container
      direction="column"
      xs={4}
      sx={{ height: "100%", margin: "0.5rem 1rem" }}
    >
      {title && (
        <Grid2>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Link href={`/dashboards/${dashboardId}/sections/${sectionId}/edit`}>
            <IconButton>
              <EditRounded />
            </IconButton>
          </Link>
        </Grid2>
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
