"use client";
import { CardActionArea } from "@mui/material";
import type { WidgetImage as WidgetImageModel } from "@prisma/client";

import { WidgetAction } from "@/types/widget.type";

export function WidgetImage({
  data,
  editing,
  handleInteraction,
}: {
  data: WidgetImageModel;
  editing: boolean;
  handleInteraction;
}): JSX.Element {
  return (
    <CardActionArea
      disabled={editing}
      onClick={(_) => handleInteraction(WidgetAction.ToggleExpanded)}
    >
      {data.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={data.url} src={data.url} width="100%" />
      )}
    </CardActionArea>
  );
}
