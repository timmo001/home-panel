"use client";
import { Card, CardContent, Unstable_Grid2 as Grid } from "@mui/material";

import { CardBase } from "@/components/dashboard/views/cards/Base";

export function EditCardBase({
  children,
  data,
}: {
  children: Array<JSX.Element> | JSX.Element;
  data: any;
}): JSX.Element {
  return (
    <Grid direction="column">
      <CardBase {...data} />
      <Card sx={{ padding: "0.4rem" }}>
        <CardContent>{children}</CardContent>
      </Card>
    </Grid>
  );
}
