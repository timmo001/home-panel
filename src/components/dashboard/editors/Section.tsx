"use client";
import { Typography, Unstable_Grid2 as Grid, IconButton } from "@mui/material";
import { EditRounded } from "@mui/icons-material";
import Link from "next/link";

export function EditSection({
  children,
  title,
}: {
  children: Array<JSX.Element>;
  title?: string;
}): JSX.Element {
  return (
    <Grid
      container
      direction="column"
      xs={4}
      sx={{ height: "100%", margin: "0.5rem 1rem" }}
    >
      {title && (
        <Grid>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Link href={`/dashboard/edit/section/${"abc123"}`}>
            <IconButton>
              <EditRounded />
            </IconButton>
          </Link>
        </Grid>
      )}
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
