"use client";
import { HassEntity } from "home-assistant-js-websocket";
import { Icon } from "@mdi/react";
import { IconButton, Typography } from "@mui/material";
import { useMemo } from "react";

import { CoverEntityFeature } from "@/utils/homeAssistant/cover";
import { domainIcon } from "@/utils/homeAssistant/icons";
import { entitySupportsFeature } from "@/utils/homeAssistant";

export function ExpandedHomeAssistantCover({ entity }: { entity: HassEntity }) {
  const isOn = useMemo<boolean>(
    () =>
      entity.state === "open" ||
      entity.state === "closing" ||
      entity.state === "opening",
    [entity]
  );

  const isOff = useMemo<boolean>(() => entity.state === "closed", [entity]);

  // const supportsPosition = useMemo<boolean>(
  //   () => entitySupportsFeature(entity, CoverEntityFeature.SET_POSITION),
  //   [entity]
  // );

  // const supportsTiltPosition = useMemo<boolean>(
  //   () => entitySupportsFeature(entity, CoverEntityFeature.SET_TILT_POSITION),
  //   [entity]
  // );

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

  console.log(entity.entity_id, {
    supportsOpenClose,
    supportsTilt,
    supportsOpenCloseWithoutStop,
  });

  return (
    <>
      {supportsOpenCloseWithoutStop ? (
        <>
          <IconButton onClick={() => {}}>
            <Icon path={domainIcon("cover", entity, "open")} />
          </IconButton>
        </>
      ) : (
        (supportsOpenClose || supportsTilt) && <></>
      )}
      <Typography variant="body1">
        {entity.attributes?.current_position &&
          `${entity.attributes.current_position} %`}
      </Typography>
    </>
  );
}
