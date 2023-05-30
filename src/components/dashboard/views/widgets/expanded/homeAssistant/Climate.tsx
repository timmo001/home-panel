"use client";
import {
  IconButton,
  Slider,
  styled,
  Typography,
  Unstable_Grid2 as Grid2,
} from "@mui/material";
import { Icon } from "@mdi/react";
import { useMemo } from "react";

import {
  CLIMATE_HVAC_ACTION_ICONS,
  CLIMATE_MODE_FEATURES,
  ClimateEntity,
  ClimateEntityFeature,
  HVAC_MODE_TO_ACTION,
  HvacAction,
  HvacMode,
} from "@/utils/homeAssistant/climate";
import {
  OFF_STATES,
  UNAVAILABLE_STATES,
  entitySupportsFeature,
} from "@/utils/homeAssistant";
import { useHomeAssistant } from "@/providers/HomeAssistantProvider";
import { mdiPower } from "@mdi/js";

const ClimateSlider = styled(Slider)({
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

export function ExpandedHomeAssistantClimate({
  entity,
}: {
  entity: ClimateEntity;
}) {
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

  const supportsTargetTemperature = useMemo<boolean>(
    () =>
      entitySupportsFeature(entity, ClimateEntityFeature.TARGET_TEMPERATURE),
    [entity]
  );

  const buttonPresets = useMemo<
    Array<{
      path: string;
      preset: string;
    }>
  >(() => {
    if (!entity.attributes?.preset_modes) return [];
    return entity.attributes?.preset_modes.map((preset: string) => {
      const button = {
        path: CLIMATE_HVAC_ACTION_ICONS[preset as HvacAction],
        preset,
      };
      console.log({ button });
      return button;
    });
  }, [entity]);

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
        <Typography variant="h3">{entity.state}</Typography>
        <Typography variant="body1">
          Current: {entity.attributes?.current_temperature}°C
        </Typography>
        <Typography variant="body1">
          Target: {entity.attributes?.temperature}°C
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
          {buttonPresets.map(({ path, preset }) => (
            <IconButton
              key={preset}
              disabled={disabled}
              onClick={() => {
                if (!disabled)
                  homeAssistant.client?.callService(
                    "climate",
                    "set_preset_mode",
                    {
                      entity_id: entity.entity_id,
                      preset_mode: preset,
                    }
                  );
              }}
            >
              <Icon color="currentColor" size={1.5} path={path} />
            </IconButton>
          ))}
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

        {supportsTargetTemperature && (
          <>
            <Typography align="left" variant="h6" sx={{ width: "100%" }}>
              Target temperature
            </Typography>
            <ClimateSlider
              aria-label="Target temperature"
              defaultValue={entity.attributes?.temperature}
              disabled={disabled}
              max={entity.attributes?.max_temp}
              min={entity.attributes?.min_temp}
              step={entity.attributes?.target_temp_step}
              valueLabelDisplay="auto"
              sx={{ color: "rgba(160, 120, 40, 1)" }}
              onChange={(_, value) => {
                homeAssistant.client?.callService(
                  "climate",
                  "set_temperature",
                  {
                    entity_id: entity.entity_id,
                    temperature: value,
                  }
                );
              }}
            />
          </>
        )}
      </Grid2>
    </>
  );
}
