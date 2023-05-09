"use client";
import { Typography } from "@mui/material";

export function AccessDenied(): JSX.Element {
  return (
    <Typography component="h5" variant="h2" sx={{ margin: "0 1rem" }}>
      Access Denied
    </Typography>
  );
}
