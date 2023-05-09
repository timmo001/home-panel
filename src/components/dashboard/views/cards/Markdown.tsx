"use client";
import { Typography } from "@mui/material";

export function CardMarkdown({ content }: { content?: string }): JSX.Element {
  return <>{content && <Typography>{content}</Typography>}</>;
}
