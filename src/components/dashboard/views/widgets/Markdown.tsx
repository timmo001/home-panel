"use client";
import type { WidgetMarkdown as WidgetMarkdownModel } from "@prisma/client";
import { Typography } from "@mui/material";

export function WidgetMarkdown({
  data,
}: {
  data: WidgetMarkdownModel;
}): JSX.Element {
  return <>{data.content && <Typography>{data.content}</Typography>}</>;
}
