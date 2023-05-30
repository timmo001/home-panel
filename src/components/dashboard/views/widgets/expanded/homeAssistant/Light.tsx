"use client";
import type { HassEntity } from "home-assistant-js-websocket";
import {
  IconButton,
  Slider,
  styled,
  Typography,
  Unstable_Grid2 as Grid2,
} from "@mui/material";
import { Icon } from "@mdi/react";
import { mdiPower } from "@mdi/js";
import { useMemo } from "react";
import Moment from "react-moment";

import { OFF_STATES, UNAVAILABLE_STATES } from "@/utils/homeAssistant";
import { ON } from "@/utils/homeAssistant";
import { primaryColorRgb } from "@/utils/theme";
import { useHomeAssistant } from "@/providers/HomeAssistantProvider";

const LightSlider = styled(Slider)({
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
});

export function ExpandedHomeAssistantLight({ entity }: { entity: HassEntity }) {
  const homeAssistant = useHomeAssistant();

  const disabled = useMemo<boolean>(
    () => UNAVAILABLE_STATES.has(entity.state),
    [entity.state]
  );

  const isOn = useMemo<boolean>(() => entity.state === ON, [entity.state]);

  const isOff = useMemo<boolean>(
    () => OFF_STATES.has(entity.state),
    [entity.state]
  );

  const brightness = useMemo<number>(
    () => Math.round((entity.attributes.brightness / 255) * 100) || 0,
    [entity.attributes?.brightness]
  );

  const rgbColors = useMemo<number[]>(
    () => entity.attributes.rgb_color || [0, 0, 0],
    [entity.attributes?.rgb_color]
  );

  return (
    <>
      <Grid2
        container
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        direction="column"
        sx={{ margin: "1rem 2rem" }}
      >
        <Typography variant="h3">
          {isOff
            ? entity.state.charAt(0).toUpperCase() + entity.state.slice(1)
            : entity.attributes?.brightness
            ? `${brightness}%`
            : entity.state.charAt(0).toUpperCase() + entity.state.slice(1)}
        </Typography>
        <Typography variant="h6">
          <Moment date={entity.last_changed} fromNow />
        </Typography>

        <Grid2
          container
          alignContent="center"
          alignItems="center"
          justifyContent="center"
          direction="row"
          spacing={2}
          sx={{ margin: "1rem", width: "420px" }}
        >
          <IconButton
            disabled={disabled}
            onClick={() => {
              if (!disabled)
                homeAssistant.client?.entityTurnOnOff(entity, !isOn);
            }}
          >
            <Icon
              color={isOn ? "currentColor" : "rgba(255, 255, 255, 0.5)"}
              path={mdiPower}
              size={1.5}
            />
          </IconButton>
        </Grid2>

        <Typography align="left" variant="h6" sx={{ width: "100%" }}>
          Brightness
        </Typography>
        <LightSlider
          aria-label="Brightness"
          defaultValue={brightness}
          max={100}
          valueLabelDisplay="auto"
          sx={{
            color: isOff
              ? "rgba(255, 255, 255, 0.5)"
              : isOn
              ? `rgb(${
                  entity?.attributes?.rgb_color?.join(", ") || primaryColorRgb
                })`
              : "currentColor",
          }}
          onChange={(_, value) => {
            homeAssistant.client?.callService("light", "turn_on", {
              entity_id: entity.entity_id,
              brightness: Math.round((value as number) * 2.55),
            });
          }}
        />
        <Typography
          align="left"
          variant="h6"
          sx={{ marginTop: "1rem", width: "100%" }}
        >
          Color
        </Typography>
        <LightSlider
          aria-label="Red"
          defaultValue={rgbColors[0]}
          max={255}
          valueLabelDisplay="auto"
          sx={{ color: "red" }}
          onChange={(_, value) => {
            homeAssistant.client?.callService("light", "turn_on", {
              entity_id: entity.entity_id,
              rgb_color: [value, rgbColors[1], rgbColors[2]],
            });
          }}
        />
        <LightSlider
          aria-label="Green"
          defaultValue={rgbColors[1]}
          max={255}
          valueLabelDisplay="auto"
          sx={{ color: "green" }}
          onChange={(_, value) => {
            homeAssistant.client?.callService("light", "turn_on", {
              entity_id: entity.entity_id,
              rgb_color: [rgbColors[0], value, rgbColors[2]],
            });
          }}
        />
        <LightSlider
          aria-label="Blue"
          defaultValue={rgbColors[2]}
          max={255}
          valueLabelDisplay="auto"
          sx={{ color: "blue" }}
          onChange={(_, value) => {
            homeAssistant.client?.callService("light", "turn_on", {
              entity_id: entity.entity_id,
              rgb_color: [rgbColors[0], rgbColors[1], value],
            });
          }}
        />
      </Grid2>
    </>
  );
}
