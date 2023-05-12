"use client";
import type { WidgetMarkdown } from "@prisma/client";
import { Typography } from "@mui/material";

export function WidgetMarkdown({ data }: { data: WidgetMarkdown }): JSX.Element {
  return <>{data.content && <Typography>{data.content}</Typography>}</>;
}
