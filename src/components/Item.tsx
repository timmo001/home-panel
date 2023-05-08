"use client";
import { Card, Typography } from "@mui/material";

export function Item({ title }: { title: string }): JSX.Element {
  return (
    <Card
      sx={{
        padding: "0.4rem",
        width: "100%",
      }}
    >
      <Typography variant="h6">{title}</Typography>
    </Card>
  );
}
