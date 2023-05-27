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
  widgetData,
}: {
  dashboardId: string;
  sectionId: string;
  widgetData: WidgetHomeAssistant;
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
    return homeAssistant.entities[widgetData.entityId];
  }, [widgetData.entityId, homeAssistant.entities]);

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
            widgetData.widgetId,
            "entityId",
            value.entity_id
          );
        }}
      />
      <FormControlLabel
        control={
          <Switch
            name="showName"
            defaultChecked={widgetData.showName || true}
            onChange={async (e) =>
              await widgetHomeAssistantUpdate(
                dashboardId,
                sectionId,
                widgetData.widgetId,
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
            defaultChecked={widgetData.showState || true}
            onChange={async (e) =>
              await widgetHomeAssistantUpdate(
                dashboardId,
                sectionId,
                widgetData.widgetId,
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
            defaultChecked={widgetData.showIcon || true}
            onChange={async (e) =>
              await widgetHomeAssistantUpdate(
                dashboardId,
                sectionId,
                widgetData.widgetId,
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
        defaultValue={widgetData.iconColor || ""}
        onChange={async (e) =>
          await widgetHomeAssistantUpdate(
            dashboardId,
            sectionId,
            widgetData.widgetId,
            e.target.name,
            e.target.value
          )
        }
      />
      <TextField
        name="iconSize"
        label="Icon Size"
        margin="dense"
        defaultValue={widgetData.iconSize || ""}
        onChange={async (e) =>
          await widgetHomeAssistantUpdate(
            dashboardId,
            sectionId,
            widgetData.widgetId,
            e.target.name,
            e.target.value
          )
        }
      />
      <Autocomplete
        defaultValue={widgetData.secondaryInfo}
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
            widgetData.widgetId,
            "secondaryInfo",
            value
          );
        }}
      />
    </>
  );
}
