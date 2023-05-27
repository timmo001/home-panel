"use client";
import type { Widget as WidgetModel } from "@prisma/client";
import {
  Box,
  Card,
  CardActionArea,
  Typography,
  Unstable_Grid2 as Grid2,
  IconButton,
  Dialog,
} from "@mui/material";
import {
  ArrowBackRounded,
  ArrowForwardRounded,
  DeleteRounded,
  EditRounded,
} from "@mui/icons-material";

import type { WidgetActionFunction } from "@/types/widget.type";
import { WidgetAction, WidgetType } from "@/types/widget.type";

export function WidgetBase({
  children,
  data,
  editing,
  expanded,
  handleInteraction,
}: {
  children: Array<JSX.Element> | JSX.Element;
  data: WidgetModel;
  editing: boolean;
  expanded: boolean;
  handleInteraction: WidgetActionFunction;
}): JSX.Element {
  const widget = (
    <Card sx={{ width: "100%" }}>
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
          textAlign:
            data.type === WidgetType.HomeAssistant ? "center" : undefined,
        }}
      >
        {children}
      </Box>
      {editing && (
        <Grid2
          container
          alignContent="center"
          justifyContent="space-around"
          sx={{ padding: "0.5rem" }}
        >
          <IconButton
            aria-label="Move Widget Back"
            size="small"
            onClick={(_) => handleInteraction(WidgetAction.MoveUp)}
          >
            <ArrowBackRounded fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Move Widget Forward"
            size="small"
            onClick={(_) => handleInteraction(WidgetAction.MoveDown)}
          >
            <ArrowForwardRounded fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Edit Widget"
            size="small"
            onClick={(_) => handleInteraction(WidgetAction.Edit)}
          >
            <EditRounded fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Delete Widget"
            size="small"
            onClick={(_) => handleInteraction(WidgetAction.Delete)}
          >
            <DeleteRounded fontSize="small" />
          </IconButton>
        </Grid2>
      )}
    </Card>
  );

  return (
    <>
      {widget}
      {expanded && (
        <Dialog
          open
          fullWidth
          onClose={(_) => handleInteraction(WidgetAction.ToggleExpanded)}
        >
          {widget}
        </Dialog>
      )}
    </>
  );
}
