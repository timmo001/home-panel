import React, { ReactElement } from "react";
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import { EntityProps } from "./Entity";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: 1,
  },
  iconContainer: {
    height: 32,
    width: 32,
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  icon: {
    transform: "translateY(-8px)",
    textAlign: "center",
    color: theme.palette.text.primary,
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1.0,
    color: theme.palette.primary.main,
  },
  iconDisabled: {
    opacity: 0.6,
  },
}));

function Fan(props: EntityProps): ReactElement | null {
  function handleSpeedChange(speed: string): void {
    if (props.handleHassChange && props.entity)
      props.handleHassChange("fan", "set_speed", {
        entity_id: props.entity.entity_id,
        speed,
      });
  }

  const classes = useStyles();

  return (
    <Grid
      className={classes.root}
      container
      spacing={1}
      alignContent="center"
      justify="center"
      direction="column">
      <Grid
        item
        xs
        container
        alignContent="center"
        justify="center"
        direction="row">
        {props.entity.attributes.speed_list.map(
          (speed: string, key: number) => {
            const icon: string | undefined =
              speed === "off"
                ? "mdi-numeric-0"
                : speed === "low"
                ? "mdi-numeric-1"
                : speed === "medium"
                ? "mdi-numeric-2"
                : speed === "high"
                ? "mdi-numeric-3"
                : undefined;
            if (icon)
              return (
                <Grid key={key} item xs={6} container justify="center">
                  <IconButton
                    className={classes.iconContainer}
                    onClick={(): void => handleSpeedChange(speed)}>
                    <span
                      className={clsx(
                        "mdi",
                        icon,
                        classes.icon,
                        props.entity.attributes.speed === speed &&
                          classes.iconActive
                      )}
                    />
                  </IconButton>
                </Grid>
              );
            return (
              <Grid key={key} item>
                <Button
                  className={clsx(
                    props.entity.attributes.hvac_action === speed &&
                      classes.iconActive
                  )}
                  onClick={(): void => handleSpeedChange(speed)}>
                  {speed}
                </Button>
              </Grid>
            );
          }
        )}
      </Grid>
    </Grid>
  );
}

export default Fan;
