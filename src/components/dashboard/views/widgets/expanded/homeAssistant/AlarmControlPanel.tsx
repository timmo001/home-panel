"use client";
import { Icon } from "@mdi/react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid2,
} from "@mui/material";
import { useMemo, useState } from "react";

import {
  ALARM_MODES,
  AlarmConfig,
  AlarmControlPanelEntity,
} from "@/utils/homeAssistant/alarmControlPanel";
import { entitySupportsFeature } from "@/utils/homeAssistant";
import { useHomeAssistant } from "@/providers/HomeAssistantProvider";

const keypad = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, "Clear"],
];

export function ExpandedHomeAssistantAlarmControlPanel({
  entity,
}: {
  entity: AlarmControlPanelEntity;
}) {
  const [code, setCode] = useState<string>("");
  const homeAssistant = useHomeAssistant();

  const buttons = useMemo<Array<AlarmConfig>>(
    () =>
      entity.state.startsWith("armed_")
        ? [ALARM_MODES["disarmed"]]
        : Object.values(ALARM_MODES).filter(({ feature }: AlarmConfig) =>
            entitySupportsFeature(entity, Number(feature))
          ),
    [entity]
  );

  return (
    <>
      <Grid2
        container
        alignContent="center"
        alignItems="center"
        direction="column"
        spacing={2}
        sx={{ margin: "0.5rem" }}
      >
        <Typography variant="h4">{entity.state}</Typography>
        <TextField
          type="password"
          variant="standard"
          label="Code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        {entity.attributes?.code_format === "number" && (
          <Stack direction="column">
            {keypad.map((row, index: number) => (
              <Stack key={index} direction="row">
                {row.map((key) => (
                  <Button
                    key={key}
                    disabled={key === null}
                    onClick={() => {
                      if (key === null) return;
                      if (key === "Clear") setCode("");
                      else setCode(code + key);
                    }}
                    sx={{ margin: "0.5rem" }}
                  >
                    {key}
                  </Button>
                ))}
              </Stack>
            ))}
          </Stack>
        )}
        <Stack direction="row" spacing={2}>
          {buttons.map(({ path, service }: AlarmConfig) => (
            <Button
              key={service}
              onClick={() => {
                homeAssistant.client?.callService(
                  "alarm_control_panel",
                  service,
                  {
                    entity_id: entity.entity_id,
                    code,
                  }
                );
              }}
            >
              <Icon color="currentColor" size={4} path={path} />
              {service}
            </Button>
          ))}
        </Stack>
      </Grid2>
    </>
  );
}
