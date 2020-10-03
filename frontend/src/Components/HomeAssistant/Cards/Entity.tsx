import React, { ReactElement } from "react";
import { HassEntity } from "home-assistant-js-websocket";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { BaseProps } from "../../Cards/Base";
import AlarmPanel from "./AlarmPanel";
import Camera from "./Camera";
import Climate from "./Climate";
import Cover from "./Cover";
import Fan from "./Fan";
import Light from "./Light";
import Media from "./Media";
import Number from "./Number";
import Select from "./Select";
import State from "./State";
import Text from "./Text";
import Toggle from "./Toggle";
import Weather from "./Weather";

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
  },
  text: {
    overflow: "hidden",
    userSelect: "none",
    textAlign: "center",
    textOverflow: "ellipsis",
  },
}));

interface EntityBaseProps extends BaseProps {
  handleHassToggle: () => void;
}

export interface EntityProps extends EntityBaseProps {
  entity: HassEntity;
}

function Entity(props: EntityBaseProps): ReactElement | null {
  const domain = props.card.entity && props.card.entity.split(".")[0].trim();

  let entity: HassEntity | undefined;

  const classes = useStyles();

  if (!props.hassAuth || !props.hassConfig || !props.hassEntities) return null;

  if (props.card.entity) entity = props.hassEntities[props.card.entity];

  if (!entity) {
    props.card.disabled = true;
    return (
      <Grid
        className={classes.root}
        container
        direction="row"
        alignContent="center"
        justify="center">
        <Grid item xs>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant="body2"
            component="h5">
            {props.card.entity
              ? `${props.card.entity} not found`
              : "No entity specified"}
          </Typography>
        </Grid>
      </Grid>
    );
  } else {
    props.card.disabled = false;
    props.card.state = entity.state;
  }

  if (
    domain === "air_quality" ||
    domain === "binary_sensor" ||
    domain === "device_tracker" ||
    domain === "geo_location" ||
    domain === "person" ||
    domain === "sensor" ||
    domain === "sun"
  )
    return <State {...props} entity={entity} />;

  if (
    domain === "group" ||
    domain === "input_boolean" ||
    domain === "lock" ||
    domain === "remote" ||
    domain === "scene" ||
    domain === "script" ||
    domain === "switch"
  )
    return <Toggle {...props} entity={entity} />;
  if (domain === "alarm_control_panel")
    return <AlarmPanel {...props} entity={entity} />;
  if (domain === "camera") return <Camera {...props} entity={entity} />;
  if (domain === "climate") return <Climate {...props} entity={entity} />;
  if (domain === "cover") return <Cover {...props} entity={entity} />;
  if (domain === "fan") return <Fan {...props} entity={entity} />;
  if (domain === "input_number") return <Number {...props} entity={entity} />;
  if (domain === "input_select") return <Select {...props} entity={entity} />;
  if (domain === "input_text") return <Text {...props} entity={entity} />;
  if (domain === "light") return <Light {...props} entity={entity} />;
  if (domain === "media_player") return <Media {...props} entity={entity} />;
  if (domain === "weather") return <Weather {...props} entity={entity} />;

  return null;
}

export default Entity;
