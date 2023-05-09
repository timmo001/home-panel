"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  Unstable_Grid2 as Grid2,
} from "@mui/material";
import { SaveRounded } from "@mui/icons-material";

import { EditCardBase } from "@/components/dashboard/editors/cards/Base";
import { EditCardMarkdown } from "@/components/dashboard/editors/cards/Markdown";
import { Item } from "@/components/dashboard/views/Item";
import { Section } from "@/components/dashboard/views/Section";

export function EditItem({ data }: { data?: any }): JSX.Element {
  return (
    <Grid2 container spacing={2}>
      <Grid2 xs="auto">
        <Card>
          <CardHeader>
            <Typography variant="h6">Edit Item</Typography>
          </CardHeader>
          <CardContent>
            <Grid2 container spacing={2}>
              <EditCardBase dataIn={data} />
              <EditCardMarkdown dataIn={data} />
            </Grid2>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button>
              <SaveRounded />
              Save
            </Button>
          </CardActions>
        </Card>
      </Grid2>
      <Grid2 xs="auto">
        <Section>{[<Item key={0} data={data} />]}</Section>
      </Grid2>
    </Grid2>
  );
}
