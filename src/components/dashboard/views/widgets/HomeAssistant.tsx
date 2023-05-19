"use client";
import type { WidgetHomeAssistant as WidgetHomeAssistantModel } from "@prisma/client";
import { useMemo } from "react";
import { HassEntity } from "home-assistant-js-websocket";
import { Icon } from "@mdi/react";
import { IconButton, Typography } from "@mui/material";

import { useHomeAssistant } from "@/providers/HomeAssistantProvider";

export function WidgetHomeAssistant({
  data,
  editing,
  expanded,
}: {
  data: WidgetHomeAssistantModel;
  editing: boolean;
  expanded: boolean;
}): JSX.Element {
  const homeAssistant = useHomeAssistant();

  const entity = useMemo<HassEntity | undefined>(() => {
    if (!homeAssistant.entities) return;
    return homeAssistant.entities[data.entityId];
  }, [data.entityId, homeAssistant.entities]);

  const entityIcon = useMemo<string>(() => {
    if (!entity?.attributes.icon) return "mdi:help";
    if (entity.attributes.icon.startsWith("mdi:")) {
      return entity.attributes.icon;
    }
    return `mdi:${entity.attributes.icon}`;
  }, [entity?.attributes.icon]);

  const mdiIcon = useMemo<string | null>(() => {
    try {
      const iconPath = entityIcon.replace(/[:|-](\w)/g, (_, match: string) =>
        match.toUpperCase()
      );
      return require(`materialdesign-js/icons/${iconPath}`).default;
    } catch (e) {
      console.error(`Could not load icon ${entityIcon}: ${e}`);
      return null;
    }
  }, [entityIcon]);

  return (
    <>
      {entity ? (
        <>
          {data.showName && (
            <Typography variant="h6">
              {entity.attributes.friendly_name}
            </Typography>
          )}
          {data.showIcon && mdiIcon && (
            <IconButton
              aria-label={entity.attributes.friendly_name}
              disabled={editing}
              onClick={() => {
                homeAssistant.client?.callService(
                  entity.entity_id.split(".")[0],
                  "toggle",
                  {
                    entity_id: entity.entity_id,
                  }
                );
              }}
            >
              <Icon
                color={data.iconColor || "currentColor"}
                path={mdiIcon}
                size={
                  !isNaN(Number(data.iconSize)) &&
                  Number(data.iconSize) > 0 &&
                  Number(data.iconSize) < 8
                    ? Number(data.iconSize)
                    : data.iconSize || 4
                }
              />
            </IconButton>
          )}
          {data.showState && (
            <Typography variant="body1">
              {entity.state}
              {entity.attributes.unit_of_measurement}
            </Typography>
          )}
          {data.secondaryInfo && (
            <Typography variant="body2">
              {data.secondaryInfo === "last_changed" ||
              data.secondaryInfo === "last_updated"
                ? entity[data.secondaryInfo]
                : entity.attributes[data.secondaryInfo]}
            </Typography>
          )}
        </>
      ) : (
        <Typography>Entity &#39;{data.entityId}&#39; not found.</Typography>
      )}
    </>
  );
}
