"use client";
import { Card, Typography } from "@mui/material";

export function CardBaseStandard({
  children,
  title,
}: {
  children: Array<JSX.Element> | JSX.Element;
  title: string;
}): JSX.Element {
  return (
    <Card
      sx={{
        padding: "0.4rem",
        width: "100%",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      {children}
    </Card>
  );
}
