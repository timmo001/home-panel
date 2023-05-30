"use client";
import { Icon } from "@mdi/react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid2,
} from "@mui/material";
import { HassEntity } from "home-assistant-js-websocket";
import { useMemo, useState } from "react";

import { entitySupportsFeature } from "@/utils/homeAssistant";
import { useHomeAssistant } from "@/providers/HomeAssistantProvider";

export function ExpandedHomeAssistantClimate({
  entity,
}: {
  entity: HassEntity;
}) {
  const homeAssistant = useHomeAssistant();

  return (
    <>
      <Grid2
        container
        alignContent="center"
        alignItems="center"
        direction="column"
        spacing={2}
        sx={{ margin: "0.5rem" }}
      ></Grid2>
    </>
  );
}
