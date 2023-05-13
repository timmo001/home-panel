"use client";
import type { WidgetHomeAssistant as WidgetHomeAssistantModel } from "@prisma/client";
import { useMemo } from "react";
import { Typography } from "@mui/material";
import { HassEntity } from "home-assistant-js-websocket";

import { useHomeAssistant } from "@/providers/HomeAssistantProvider";

export function WidgetHomeAssistant({
  data,
}: {
  data: WidgetHomeAssistantModel;
}): JSX.Element {
  const homeAssistant = useHomeAssistant();

  const entity = useMemo<HassEntity | undefined>(() => {
    if (!homeAssistant.entities) return;
    return homeAssistant.entities[data.entityId];
  }, [data.entityId, homeAssistant.entities]);

  return (
    <>
      {entity ? (
        <>
          {data.showName && (
            <Typography variant="h6">
              {entity.attributes.friendly_name}
            </Typography>
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
