"use client";
import type { HassEntity } from "home-assistant-js-websocket";
import { useMemo } from "react";
import { WidgetHomeAssistant } from "@prisma/client";
import {
  Autocomplete,
  FormControlLabel,
  Skeleton,
  Switch,
  TextField,
} from "@mui/material";

import { widgetHomeAssistantUpdate } from "@/utils/serverActions/widget";
import { useHomeAssistant } from "@/providers/HomeAssistantProvider";

export function EditWidgetHomeAssistant({
  dashboardId,
  sectionId,
  data,
}: {
  dashboardId: string;
  sectionId: string;
  data: WidgetHomeAssistant;
}): JSX.Element {
  const homeAssistant = useHomeAssistant();

  const entities = useMemo<Array<HassEntity> | undefined>(() => {
    if (!homeAssistant.entities) return;
    return Object.values(homeAssistant.entities).sort((a, b) =>
      a.entity_id.localeCompare(b.entity_id)
    );
  }, [homeAssistant.entities]);

  const defaultEntity = useMemo<HassEntity | undefined>(() => {
    if (!homeAssistant.entities) return;
    return homeAssistant.entities[data.entityId];
  }, [data.entityId, homeAssistant.entities]);

  const entityAttributes = useMemo<Array<string> | undefined>(() => {
    if (!defaultEntity) return;
    return Object.keys(defaultEntity.attributes)
      .concat(["last_changed", "last_updated"])
      .sort((a, b) => a.localeCompare(b));
  }, [defaultEntity]);

  if (!homeAssistant.entities || !entities)
    return <Skeleton variant="text" width="100%" />;

  return (
    <>
      <Autocomplete
        defaultValue={defaultEntity}
        options={entities || []}
        getOptionLabel={(option: HassEntity) => {
          return `${option.entity_id} - ${option.attributes.friendly_name}`;
        }}
        groupBy={(option: HassEntity) => {
          return option.entity_id.split(".")[0];
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            name="entityId"
            label="Entity ID"
            margin="dense"
            required
          />
        )}
        onChange={async (_, value: HassEntity | null) => {
          if (!value) return;
          await widgetHomeAssistantUpdate(
            dashboardId,
            sectionId,
            data.widgetId,
            "entityId",
            value.entity_id
          );
        }}
      />
      <FormControlLabel
        control={
          <Switch
            name="showName"
            defaultChecked={data.showName || true}
            onChange={async (e) =>
              await widgetHomeAssistantUpdate(
                dashboardId,
                sectionId,
                data.widgetId,
                e.target.name,
                e.target.checked
              )
            }
          />
        }
        label="Show Name"
      />
      <FormControlLabel
        control={
          <Switch
            name="showState"
            defaultChecked={data.showState || true}
            onChange={async (e) =>
              await widgetHomeAssistantUpdate(
                dashboardId,
                sectionId,
                data.widgetId,
                e.target.name,
                e.target.checked
              )
            }
          />
        }
        label="Show State"
      />
      <FormControlLabel
        control={
          <Switch
            name="showIcon"
            defaultChecked={data.showIcon || true}
            onChange={async (e) =>
              await widgetHomeAssistantUpdate(
                dashboardId,
                sectionId,
                data.widgetId,
                e.target.name,
                e.target.checked
              )
            }
          />
        }
        label="Show Icon"
      />
      <TextField
        name="iconColor"
        label="Icon Color"
        margin="dense"
        defaultValue={data.iconColor || ""}
        onChange={async (e) =>
          await widgetHomeAssistantUpdate(
            dashboardId,
            sectionId,
            data.widgetId,
            e.target.name,
            e.target.value
          )
        }
      />
      <TextField
        name="iconSize"
        label="Icon Size"
        margin="dense"
        defaultValue={data.iconSize || ""}
        onChange={async (e) =>
          await widgetHomeAssistantUpdate(
            dashboardId,
            sectionId,
            data.widgetId,
            e.target.name,
            e.target.value
          )
        }
      />
      <Autocomplete
        defaultValue={data.secondaryInfo}
        options={entityAttributes || []}
        renderInput={(params) => (
          <TextField
            {...params}
            name="secondaryInfo"
            label="Secondary Info"
            margin="dense"
          />
        )}
        onChange={async (_, value: string | null) => {
          if (!value) return;
          await widgetHomeAssistantUpdate(
            dashboardId,
            sectionId,
            data.widgetId,
            "secondaryInfo",
            value
          );
        }}
      />
    </>
  );
}
