"use client";
import { Card, Typography } from "@mui/material";

export function CardBase({
  children,
  title,
}: {
  children: Array<JSX.Element> | JSX.Element;
  title?: string;
}): JSX.Element {
  return (
    <Card
      sx={{
        padding: title ? "0.2rem 0.4rem 0.4rem" : "0.4rem",
        width: "100%",
      }}
    >
      {title && <Typography variant="h6">{title}</Typography>}
      {children}
    </Card>
  );
}
