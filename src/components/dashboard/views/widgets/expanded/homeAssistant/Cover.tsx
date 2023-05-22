"use client";
import { HassEntity } from "home-assistant-js-websocket";
import { Icon } from "@mdi/react";
import { IconButton, Typography, Unstable_Grid2 as Grid2 } from "@mui/material";
import { mdiArrowBottomLeft, mdiArrowTopRight, mdiStop } from "@mdi/js";
import { useMemo } from "react";

import {
  CoverEntityFeature,
  canClose,
  canCloseTilt,
  canOpen,
  canOpenTilt,
  canStop,
  canStopTilt,
} from "@/utils/homeAssistant/cover";
import { domainIcon } from "@/utils/homeAssistant/icons";
import { primaryColorRgb } from "@/utils/theme";
import { useHomeAssistant } from "@/providers/HomeAssistantProvider";
import { entitySupportsFeature } from "@/utils/homeAssistant";

type CoverLayout = {
  type: "cross" | "vertical";
  items: Array<CoverLayoutItem>;
};

type CoverLayoutItem = {
  icon: string;
  service: string | null;
};

export function ExpandedHomeAssistantCover({ entity }: { entity: HassEntity }) {
  const homeAssistant = useHomeAssistant();

  const layout = useMemo<CoverLayout>(() => {
    const supportsOpen = entitySupportsFeature(entity, CoverEntityFeature.OPEN);
    const supportsClose = entitySupportsFeature(
      entity,
      CoverEntityFeature.CLOSE
    );
    const supportsStop = entitySupportsFeature(entity, CoverEntityFeature.STOP);
    const supportsOpenTilt = entitySupportsFeature(
      entity,
      CoverEntityFeature.OPEN_TILT
    );
    const supportsCloseTilt = entitySupportsFeature(
      entity,
      CoverEntityFeature.CLOSE_TILT
    );
    const supportsStopTilt = entitySupportsFeature(
      entity,
      CoverEntityFeature.STOP_TILT
    );

    const items: Array<CoverLayoutItem> = [];
    if (supportsOpen)
      items.push({
        icon: domainIcon("cover", entity, "open"),
        service: "open_cover",
      });

    if (supportsCloseTilt)
      items.push({
        icon: mdiArrowBottomLeft,
        service: "close_cover_tilt",
      });

    if (supportsStop || supportsStopTilt)
      items.push({
        icon: mdiStop,
        service: "stop",
      });

    if (supportsOpenTilt)
      items.push({
        icon: mdiArrowTopRight,
        service: "open_cover_tilt",
      });

    if (supportsClose)
      items.push({
        icon: domainIcon("cover", entity, "closed"),
        service: "close_cover",
      });

    if (
      (supportsOpen || supportsClose) &&
      (supportsOpenTilt || supportsCloseTilt)
    )
      return { type: "cross", items };

    if (supportsOpen || supportsClose) return { type: "vertical", items };

    if (supportsOpenTilt || supportsCloseTilt)
      return { type: "vertical", items };

    return { type: "vertical", items: [] };
  }, [entity]);

  const coverCanOpen = useMemo<boolean>(() => canOpen(entity), [entity]);

  const coverCanOpenTilt = useMemo<boolean>(
    () => canOpenTilt(entity),
    [entity]
  );

  const coverCanStop = useMemo<boolean>(
    () => canStop(entity) || canStopTilt(entity),
    [entity]
  );

  const coverCanStopTilt = useMemo<boolean>(
    () => canStopTilt(entity),
    [entity]
  );

  const coverCanClose = useMemo<boolean>(() => canClose(entity), [entity]);

  const coverCanCloseTilt = useMemo<boolean>(
    () => canCloseTilt(entity),
    [entity]
  );

  const isOn = useMemo<boolean>(
    () =>
      entity.state === "open" ||
      entity.state === "closing" ||
      entity.state === "opening",
    [entity]
  );

  const isOff = useMemo<boolean>(() => entity.state === "closed", [entity]);

  return (
    <>
      <Grid2
        container
        alignContent="center"
        direction="column"
        spacing={2}
        sx={{ margin: "0.5rem" }}
      >
        <Typography variant="h4">
          {entity.state}
          {" - "}
          {entity.attributes?.current_position &&
            `${entity.attributes.current_position} %`}
        </Typography>
        {layout.items.map(({ icon, service }) => {
          let active = false;
          let disabled = false;
          switch (service) {
            case "open_cover":
              active = coverCanOpen;
              disabled = !coverCanOpen;
              break;
            case "open_cover_tilt":
              active = coverCanOpenTilt;
              disabled = !coverCanOpenTilt;
              break;
            case "stop":
              if (!coverCanStop && !coverCanStopTilt) service = null;
              else if (coverCanStop) service = "stop_cover";
              else if (coverCanStopTilt) service = "stop_cover_tilt";
              break;
            case "close_cover":
              active = coverCanClose;
              disabled = !coverCanClose;
              break;
            case "close_cover_tilt":
              active = coverCanCloseTilt;
              disabled = !coverCanCloseTilt;
              break;
          }

          return (
            <IconButton
              key={service}
              disabled={disabled || service === null}
              onClick={() => {
                if (!service) return;
                homeAssistant.client?.callService("cover", service, {
                  entity_id: entity.entity_id,
                });
              }}
            >
              <Icon color="currentColor" size={4} path={icon} />
            </IconButton>
          );
        })}

        {/* {layout} */}
        {/* <IconButton
    disabled={!supportsOpenTilt || }
    onClick={() => {
      homeAssistant.client?.callService(
        "cover",
        supportsOpenTilt ? "open_cover_tilt" : "open_cover",
        {
          entity_id: entity.entity_id,
        }
      );
    }}
  >
    <Icon
      color={isOn ? `rgb(${primaryColorRgb}` : "currentColor"}
      size={4}
      path={
        supportsOpenTilt
          ? mdiArrowTopRight
          : domainIcon("cover", entity, "open")
      }
    />
  </IconButton>
        {(supportsStop || supportsStopTilt) && (
          <IconButton
            disabled={isUnavailable || !supportsStop || !supportsStopTilt}
            onClick={() => {
              homeAssistant.client?.callService(
                "cover",
                supportsStopTilt ? "stop_cover_tilt" : "stop_cover",
                {
                  entity_id: entity.entity_id,
                }
              );
            }}
          >
            <Icon color="currentColor" size={4} path={mdiStop} />
          </IconButton>
        )}
        <IconButton
          disabled={}
          onClick={() => {
            homeAssistant.client?.callService(
              "cover",
              supportsCloseTilt ? "close_cover_tilt" : "close_cover",
              {
                entity_id: entity.entity_id,
              }
            );
          }}
        >
          <Icon
            color={isOff ? `rgb(${primaryColorRgb}` : "currentColor"}
            size={4}
            path={
              supportsCloseTilt
                ? mdiArrowBottomLeft
                : domainIcon("cover", entity, "closed")
            }
          />
        </IconButton> */}
      </Grid2>
    </>
  );
}
