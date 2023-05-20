"use client";
import type { WidgetHomeAssistant as WidgetHomeAssistantModel } from "@prisma/client";
import { useMemo } from "react";
import { HassEntity } from "home-assistant-js-websocket";
import { Icon } from "@mdi/react";
import { IconButton, Typography } from "@mui/material";

import { useHomeAssistant } from "@/providers/HomeAssistantProvider";
import { WidgetAction } from "@/types/widget.type";
import { WidgetImage } from "@/components/dashboard/views/widgets/Image";

export function WidgetHomeAssistant({
  data,
  editing,
  expanded,
  handleInteraction,
}: {
  data: WidgetHomeAssistantModel;
  editing: boolean;
  expanded: boolean;
  handleInteraction: (action: WidgetAction) => void;
}): JSX.Element {
  const homeAssistant = useHomeAssistant();

  const entity = useMemo<HassEntity | undefined>(() => {
    if (!homeAssistant.entities) return;
    return homeAssistant.entities[data.entityId];
  }, [data.entityId, homeAssistant.entities]);

  const clickable = useMemo<boolean>(() => {
    if (!entity) return false;
    const domain = entity.entity_id.split(".")[0];
    if (!homeAssistant.services?.[domain]?.["toggle"]) return false;
    return true;
  }, [entity, homeAssistant.services]);

  const entityIcon = useMemo<string>(() => {
    if (!entity?.attributes.icon) return "mdi:help";
    if (entity.attributes.icon.startsWith("mdi:")) {
      return entity.attributes.icon;
    }
    return `mdi:${entity.attributes.icon}`;
  }, [entity?.attributes.icon]);

  const mdiIcon = useMemo<string>(() => {
    try {
      const iconPath = entityIcon.replace(/[:|-](\w)/g, (_, match: string) =>
        match.toUpperCase()
      );
      return require(`materialdesign-js/icons/${iconPath}`).default;
    } catch (e) {
      console.warn(`Could not load icon ${entityIcon}:`, e);
      return require(`materialdesign-js/icons/mdiHelp`).default;
    }
  }, [entityIcon]);

  const icon = (
    <Icon
      color={
        data.iconColor || entity?.state === "unavailiable"
          ? "rgba(255, 255, 255, 0.5)"
          : entity?.state === "on"
          ? `rgba(${
              entity?.attributes?.rgb_color?.join(", ") || "255, 255, 0"
            }, ${255 / entity?.attributes?.brightness || 1})`
          : "currentColor"
      }
      path={mdiIcon}
      size={
        !isNaN(Number(data.iconSize)) &&
        Number(data.iconSize) > 0 &&
        Number(data.iconSize) < 8
          ? Number(data.iconSize)
          : data.iconSize || 4
      }
    />
  );

  const state = useMemo<JSX.Element | null>(() => {
    if (!entity || !data.showState) return null;
    const domain = entity.entity_id.split(".")[0];

    switch (domain) {
      case "camera":
        return (
          <WidgetImage
            data={{
              url: `${homeAssistant.client?.baseUrl()}${
                entity.attributes.entity_picture
              }`,
              widgetId: data.widgetId,
            }}
            editing={editing}
            handleInteraction={handleInteraction}
          />
        );
      default:
        if (clickable && data.showIcon) return null;
        return (
          <Typography variant="body1">
            {entity.state} {entity.attributes.unit_of_measurement}
          </Typography>
        );
    }
  }, [
    clickable,
    data,
    editing,
    entity,
    homeAssistant.client,
    handleInteraction,
  ]);

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
            <>
              {clickable ? (
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
                  {icon}
                </IconButton>
              ) : (
                icon
              )}
            </>
          )}
          {state}
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
