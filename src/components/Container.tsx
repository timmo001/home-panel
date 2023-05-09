"use client";
import { Unstable_Grid2 as Grid } from "@mui/material";

export function Container({
  children,
}: {
  children: React.ReactNode | Array<React.ReactNode>;
}): JSX.Element {
  return (
    <Grid
      container
      direction="column"
      alignContent="flex-start"
      sx={{
        overflowY: "auto",
        padding: "0.4rem",
        width: "100%",
      }}
    >
      {children}
    </Grid>
  );
}
