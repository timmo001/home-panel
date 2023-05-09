"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
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
    <Grid2
      container
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ width: "100%" }}
      xs
    >
      <Grid2 xs>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Edit Item
            </Typography>
            <Grid2 container direction="column">
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
      <Grid2 xs>
        <Section>{[<Item key={0} data={data} />]}</Section>
      </Grid2>
    </Grid2>
  );
}
