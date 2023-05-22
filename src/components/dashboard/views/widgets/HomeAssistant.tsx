"use client";
import type { WidgetHomeAssistant as WidgetHomeAssistantModel } from "@prisma/client";
import { HassEntity } from "home-assistant-js-websocket";
import { Icon } from "@mdi/react";
import { IconButton, Typography } from "@mui/material";
import { useLongPress } from "use-long-press";
import { useMemo } from "react";

import {
  DEFAULT_DOMAIN_ICON,
  DOMAINS_TOGGLE,
  STATES_OFF,
} from "@/utils/homeAssistant/const";
import { domainIcon } from "@/utils/homeAssistant/icons";
import { ExpandedHomeAssistantCover } from "@/components/dashboard/views/widgets/expanded/homeAssistant/Cover";
import { primaryColorRgb } from "@/utils/theme";
import { useHomeAssistant } from "@/providers/HomeAssistantProvider";
import { WidgetAction } from "@/types/widget.type";
import { WidgetImage } from "@/components/dashboard/views/widgets/Image";

const DOMAINS_WITH_ACTIVATE_CONDITION = new Set(["cover"]);

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
  const longPress = useLongPress(() =>
    handleInteraction(WidgetAction.ToggleExpanded)
  );
  const homeAssistant = useHomeAssistant();

  const entity = useMemo<HassEntity | undefined>(() => {
    if (!homeAssistant.entities) return;
    return homeAssistant.entities[data.entityId];
  }, [data.entityId, homeAssistant.entities]);

  const canTurnOnOff = useMemo<boolean>(() => {
    if (!homeAssistant.client || !entity) return false;
    return homeAssistant.client.entityCanTurnOnOff(entity);
  }, [entity, homeAssistant.client]);

  const clickable = useMemo<boolean>(() => {
    if (!homeAssistant.client || !entity) return false;
    return canTurnOnOff;
  }, [canTurnOnOff, entity, homeAssistant.client]);

  const mdiIcon = useMemo<string>(() => {
    if (!entity) return DEFAULT_DOMAIN_ICON;
    const domain = entity.entity_id.split(".")[0];
    let icon = domainIcon(domain, entity, entity.state);

    if (entity.attributes?.icon) {
      const iconPath = entity.attributes.icon.replace(
        /[:|-](\w)/g,
        (_, match: string) => match.toUpperCase()
      );

      try {
        icon = require(`materialdesign-js/icons/${iconPath}`).default;
      } catch (e) {
        console.warn(`Could not load icon ${iconPath}:`, e);
        if (!icon) icon = require(`materialdesign-js/icons/mdiHelp`).default;
      }
    }
    return icon;
  }, [entity]);

  const entityIsOn = useMemo<boolean>(() => {
    if (!entity) return false;
    const domain = entity.entity_id.split(".")[0];
    return DOMAINS_TOGGLE.has(domain) && !STATES_OFF.includes(entity.state);
  }, [entity]);

  const icon = useMemo<JSX.Element>(
    () => (
      <Icon
        color={
          data.iconColor || entity?.state === "unavailiable"
            ? "rgba(255, 255, 255, 0.5)"
            : entityIsOn
            ? `rgba(${
                entity?.attributes?.rgb_color?.join(", ") || primaryColorRgb
              }, ${entity?.attributes?.brightness / 255 || 1})`
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
    ),
    [
      data.iconColor,
      data.iconSize,
      entity?.attributes?.brightness,
      entity?.attributes?.rgb_color,
      entity?.state,
      entityIsOn,
      mdiIcon,
    ]
  );

  const state = useMemo<JSX.Element | null>(() => {
    if (!entity || !data.showState) return null;
    const domain = entity.entity_id.split(".")[0];

    if (expanded && DOMAINS_WITH_ACTIVATE_CONDITION.has(domain)) {
      switch (domain) {
        case "cover":
          return <ExpandedHomeAssistantCover entity={entity} />;
        default:
          return null;
      }
    } else {
      switch (domain) {
        case "camera":
          return (
            <WidgetImage
              data={{
                url: `${homeAssistant.client?.baseUrl()}${
                  entity.attributes?.entity_picture
                }`,
                widgetId: data.widgetId,
              }}
              editing={editing}
              handleInteraction={handleInteraction}
            />
          );
        default:
          return (
            <>
              {data.showIcon && mdiIcon && (
                <>
                  {clickable ? (
                    <IconButton
                      aria-label={entity.attributes.friendly_name}
                      disabled={editing}
                      onClick={() => {
                        if (
                          canTurnOnOff &&
                          !DOMAINS_WITH_ACTIVATE_CONDITION.has(
                            entity.entity_id.split(".")[0]
                          )
                        )
                          homeAssistant.client?.entityTurnOnOff(
                            entity,
                            !entityIsOn
                          );
                        else handleInteraction(WidgetAction.ToggleExpanded);
                      }}
                      {...longPress()}
                    >
                      {icon}
                    </IconButton>
                  ) : (
                    icon
                  )}
                </>
              )}
              <Typography variant="body1">
                {entity.state} {entity.attributes?.unit_of_measurement}
              </Typography>
            </>
          );
      }
    }
  }, [
    canTurnOnOff,
    clickable,
    data,
    editing,
    entity,
    entityIsOn,
    expanded,
    handleInteraction,
    homeAssistant.client,
    icon,
    mdiIcon,
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
