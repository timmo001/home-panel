"use client";
import { HassEntity } from "home-assistant-js-websocket";
import {
  IconButton,
  Typography,
  Unstable_Grid2 as Grid2,
  Slider,
  Box,
  styled,
} from "@mui/material";
import {
  HSLSliderProvider,
  HueSlider,
  SaturationSlider,
  LightnessSlider,
} from "@igloo_cloud/material-ui-color-sliders";
import { mdiBrightness7, mdiPalette, mdiPower } from "@mdi/js";
import { Icon } from "@mdi/react";
import { useMemo, useState } from "react";

import { OFF_STATES, UNAVAILABLE_STATES } from "@/utils/homeAssistant";
import { ON } from "@/utils/homeAssistant";
import { primaryColorRgb } from "@/utils/theme";
import { useHomeAssistant } from "@/providers/HomeAssistantProvider";
import Moment from "react-moment";

const BrightnessSlider = styled(Slider)({
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
  const [colorMode, setColorMode] = useState<boolean>(false);
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
          <IconButton onClick={() => setColorMode(!colorMode)}>
            <Icon
              color={isOn ? "currentColor" : "rgba(255, 255, 255, 0.5)"}
              path={colorMode ? mdiBrightness7 : mdiPalette}
              size={1.5}
            />
          </IconButton>
        </Grid2>

        {colorMode ? (
          <Box sx={{ margin: "1rem", width: "100%" }}>
            <HSLSliderProvider>
              <HueSlider />
              <SaturationSlider />
              <LightnessSlider />
            </HSLSliderProvider>
          </Box>
        ) : (
          <Box sx={{ margin: "1rem", width: "100%" }}>
            <BrightnessSlider
              aria-label="Brightness"
              defaultValue={brightness}
              max={100}
              valueLabelDisplay="auto"
              sx={{
                color: isOff
                  ? "rgba(255, 255, 255, 0.5)"
                  : isOn
                  ? `rgb(${
                      entity?.attributes?.rgb_color?.join(", ") ||
                      primaryColorRgb
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
          </Box>
        )}
      </Grid2>
    </>
  );
}
