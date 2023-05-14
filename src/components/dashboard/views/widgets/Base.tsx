"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import { MouseEventHandler } from "react";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

import { WidgetType } from "@/types/widget.type";

export function WidgetBase({
  children,
  data,
  editing,
  handleInteraction,
}: {
  children: Array<JSX.Element> | JSX.Element;
  data: WidgetModel;
  editing: boolean;
  handleInteraction: MouseEventHandler<HTMLButtonElement>;
}): JSX.Element {
  const path = usePathname();

  const interactionDisabled = editing || path.endsWith("edit");

  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea
        disabled={interactionDisabled}
        onClick={handleInteraction}
      >
        {data.title && (
          <Typography variant="h6" sx={{ margin: "0.2rem 0.4rem 0.2rem" }}>
            {data.title}
          </Typography>
        )}
        <Box
          sx={{
            padding:
              data.type === WidgetType.Image
                ? 0
                : data.title
                ? "0 0.4rem 0.4rem"
                : "0.4rem",
          }}
        >
          {children}
        </Box>
      </CardActionArea>
    </Card>
  );
}
