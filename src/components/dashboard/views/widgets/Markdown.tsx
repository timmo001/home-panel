"use client";
import type { WidgetMarkdown as WidgetMarkdownModel } from "@prisma/client";
import { Typography } from "@mui/material";

import type { WidgetModel } from "@/types/widget.type";

export function WidgetMarkdown({
  widget,
}: {
  widget: WidgetModel<WidgetMarkdownModel>;
}): JSX.Element {
  const { content } = widget.data;
  return <Typography>{content}</Typography>;
}
