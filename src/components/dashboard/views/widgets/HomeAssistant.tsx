"use client";
import type { WidgetHomeAssistant as WidgetHomeAssistantModel } from "@prisma/client";
import { HassEntity } from "home-assistant-js-websocket";
import { Icon } from "@mdi/react";
import { IconButton, Typography } from "@mui/material";
import { useLongPress } from "use-long-press";
import { useMemo } from "react";

import type { WidgetModel } from "@/types/widget.type";
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
  editing,
  expanded,
  widget,
  handleInteraction,
}: {
  editing: boolean;
  expanded: boolean;
  widget: WidgetModel<WidgetHomeAssistantModel>;
  handleInteraction: (action: WidgetAction) => void;
}): JSX.Element {
  const { id } = widget;
  const {
    entityId,
    iconColor,
    iconSize,
    secondaryInfo,
    showIcon,
    showName,
    showState,
  } = widget.data;

  const longPress = useLongPress(() =>
    handleInteraction(WidgetAction.ToggleExpanded)
  );
  const homeAssistant = useHomeAssistant();

  const entity = useMemo<HassEntity | undefined>(() => {
    if (!homeAssistant.entities) return;
    return homeAssistant.entities[entityId];
  }, [entityId, homeAssistant.entities]);

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
          iconColor || entity?.state === "unavailiable"
            ? "rgba(255, 255, 255, 0.5)"
            : entityIsOn
            ? `rgba(${
                entity?.attributes?.rgb_color?.join(", ") || primaryColorRgb
              }, ${entity?.attributes?.brightness / 255 || 1})`
            : "currentColor"
        }
        path={mdiIcon}
        size={
          !isNaN(Number(iconSize)) &&
          Number(iconSize) > 0 &&
          Number(iconSize) < 8
            ? Number(iconSize)
            : iconSize || 4
        }
      />
    ),
    [
      iconColor,
      iconSize,
      entity?.attributes?.brightness,
      entity?.attributes?.rgb_color,
      entity?.state,
      entityIsOn,
      mdiIcon,
    ]
  );

  const state = useMemo<JSX.Element | null>(() => {
    if (!entity || !showState) return null;
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
              editing={editing}
              handleInteraction={handleInteraction}
              widget={{
                ...widget,
                data: {
                  url: `${homeAssistant.client?.baseUrl()}${
                    entity.attributes?.entity_picture
                  }`,
                  widgetId: id,
                },
              }}
            />
          );
        default:
          return (
            <>
              {showIcon && mdiIcon && (
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
    editing,
    entity,
    entityIsOn,
    expanded,
    handleInteraction,
    homeAssistant.client,
    icon,
    id,
    longPress,
    mdiIcon,
    showIcon,
    showState,
    widget,
  ]);

  return (
    <>
      {!homeAssistant.entities ? (
        <Typography color="secondary">
          Home Assistant is connecting / not connected.
        </Typography>
      ) : entity ? (
        <>
          {showName && (
            <Typography variant="h6">
              {entity.attributes.friendly_name}
            </Typography>
          )}
          {state}
          {secondaryInfo && (
            <Typography variant="body2">
              {secondaryInfo === "last_changed" ||
              secondaryInfo === "last_updated"
                ? entity[secondaryInfo]
                : entity.attributes[secondaryInfo]}
            </Typography>
          )}
        </>
      ) : (
        <Typography color="error">
          Entity &#39;{entityId}&#39; not found.
        </Typography>
      )}
    </>
  );
}
