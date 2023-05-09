"use client";
import {
  Card,
  CardContent,
  Dialog,
  Unstable_Grid2 as Grid,
} from "@mui/material";

import { CardBase } from "@/views/cards/Base";

export function EditCardBase({
  children,
  data,
}: {
  children: Array<JSX.Element> | JSX.Element;
  data: any;
}): JSX.Element {
  return (
    <Dialog open>
      <Grid direction="column">
        <CardBase {...data} />
        <Card sx={{ padding: "0.4rem" }}>
          <CardContent>{children}</CardContent>
        </Card>
      </Grid>
    </Dialog>
  );
}
