"use client";
import { useMemo } from "react";
import { HassEntity } from "home-assistant-js-websocket";
import { Typography } from "@mui/material";

import { CoverEntityFeature } from "@/utils/homeAssistant/cover";
import { entitySupportsFeature } from "@/utils/homeAssistant";

export function ExpandedHomeAssistantCover({ entity }: { entity: HassEntity }) {
  const supportsPosition = useMemo<boolean>(
    () => entitySupportsFeature(entity, CoverEntityFeature.SET_POSITION),
    [entity]
  );

  const supportsTiltPosition = useMemo<boolean>(
    () => entitySupportsFeature(entity, CoverEntityFeature.SET_TILT_POSITION),
    [entity]
  );

  const supportsOpenClose = useMemo<boolean>(
    () =>
      entitySupportsFeature(entity, CoverEntityFeature.OPEN) ||
      entitySupportsFeature(entity, CoverEntityFeature.CLOSE) ||
      entitySupportsFeature(entity, CoverEntityFeature.STOP),
    [entity]
  );

  const supportsTilt = useMemo<boolean>(
    () =>
      entitySupportsFeature(entity, CoverEntityFeature.OPEN_TILT) ||
      entitySupportsFeature(entity, CoverEntityFeature.CLOSE_TILT) ||
      entitySupportsFeature(entity, CoverEntityFeature.STOP_TILT),
    [entity]
  );

  const supportsOpenCloseWithoutStop = useMemo<boolean>(
    () =>
      entitySupportsFeature(entity, CoverEntityFeature.OPEN) &&
      entitySupportsFeature(entity, CoverEntityFeature.CLOSE) &&
      !entitySupportsFeature(entity, CoverEntityFeature.STOP) &&
      !entitySupportsFeature(entity, CoverEntityFeature.OPEN_TILT) &&
      !entitySupportsFeature(entity, CoverEntityFeature.CLOSE_TILT),
    [entity]
  );

  return (
    <>
      <Typography variant="body1">
        {entity.attributes?.current_position &&
          `${entity.attributes.current_position} %`}
      </Typography>
    </>
  );
}
