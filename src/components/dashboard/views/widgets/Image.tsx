"use client";
import type { WidgetImage as WidgetImageModel } from "@prisma/client";
import { CardActionArea } from "@mui/material";

import type { WidgetActionFunction, WidgetModel } from "@/types/widget.type";
import { WidgetAction } from "@/types/widget.type";

export function WidgetImage({
  editing,
  widget,
  handleInteraction,
}: {
  editing: boolean;
  widget: WidgetModel<WidgetImageModel>;
  handleInteraction: WidgetActionFunction;
}): JSX.Element {
  const { url } = widget.data;
  return (
    <CardActionArea
      disabled={editing}
      onClick={(_) => handleInteraction(WidgetAction.ToggleExpanded)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={url} src={url} width="100%" />
    </CardActionArea>
  );
}
