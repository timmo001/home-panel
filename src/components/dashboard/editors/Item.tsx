"use client";
import { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Unstable_Grid2 as Grid2,
} from "@mui/material";
import { SaveRounded } from "@mui/icons-material";

import type { CardData } from "@/types/card.type";
import { EditCardBase } from "@/components/dashboard/editors/cards/Base";
import { EditCardMarkdown } from "@/components/dashboard/editors/cards/Markdown";
import { Item } from "@/components/dashboard/views/Item";
import { Section } from "@/components/dashboard/views/Section";

export function EditItem({ data }: { data: CardData }): JSX.Element {
  return (
    <Grid2
      container
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ width: "100%" }}
      xs
    >
      <Grid2 xs sx={{ height: "100%" }}>
        <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5">Edit Item</Typography>
            <Grid2 container direction="column" sx={{ marginTop: "1rem" }}>
              <EditCardBase data={data} />
              <EditCardMarkdown data={data} />
            </Grid2>
          </CardContent>
          {/* <CardActions sx={{ justifyContent: "center" }}>
            <Button onClick={() => handleSaveCard()}>
              <SaveRounded sx={{ marginRight: "0.4rem" }} />
              Save
            </Button>
          </CardActions> */}
        </Card>
      </Grid2>
      <Grid2 xs>
        <Section>{[<Item key={0} data={data} />]}</Section>
      </Grid2>
    </Grid2>
  );
}
