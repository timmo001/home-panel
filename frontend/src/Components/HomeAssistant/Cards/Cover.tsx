import React, { ReactElement } from "react";
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import { EntityProps } from "./Entity";

const useStyles = makeStyles((theme: Theme) => ({
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
  },
  iconDisabled: {
    opacity: 0.6,
  },
}));

function Cover(props: EntityProps): ReactElement | null {
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={1}
      alignContent="center"
      justify="space-between"
      direction="column">
      <Grid
        item
        xs
        container
        alignContent="center"
        justify="space-around"
        direction="row">
        <Grid item>
          <IconButton
            className={classes.iconContainer}
            disabled={props.entity.attributes.current_position > 99}
            onClick={(): void =>
              props.handleHassChange &&
              props.handleHassChange("cover", "open_cover", {
                entity_id: props.entity.entity_id,
              })
            }>
            <span
              className={clsx(
                "mdi",
                "mdi-arrow-up",
                classes.icon,
                props.entity.attributes.current_position > 99 &&
                  classes.iconDisabled
              )}
            />
          </IconButton>
          <IconButton
            className={classes.iconContainer}
            onClick={(): void =>
              props.handleHassChange &&
              props.handleHassChange("cover", "stop_cover", {
                entity_id: props.entity.entity_id,
              })
            }>
            <span className={clsx("mdi", "mdi-stop", classes.icon)} />
          </IconButton>
          <IconButton
            className={classes.iconContainer}
            disabled={props.entity.attributes.current_position < 1}
            onClick={(): void =>
              props.handleHassChange &&
              props.handleHassChange("cover", "close_cover", {
                entity_id: props.entity.entity_id,
              })
            }>
            <span
              className={clsx(
                "mdi",
                "mdi-arrow-down",
                classes.icon,
                props.entity.attributes.current_position < 1 &&
                  classes.iconDisabled
              )}
            />
          </IconButton>
        </Grid>
        {props.entity.attributes.current_tilt_position !== undefined &&
        (!props.card.width || props.card.width > 1) ? (
          <Grid item>
            <IconButton
              className={classes.iconContainer}
              disabled={props.entity.attributes.current_tilt_position > 99}
              onClick={(): void =>
                props.handleHassChange &&
                props.handleHassChange("cover", "open_cover_tilt", {
                  entity_id: props.entity.entity_id,
                })
              }>
              <span
                className={clsx(
                  "mdi",
                  "mdi-arrow-top-right",
                  classes.icon,
                  props.entity.attributes.current_tilt_position > 99 &&
                    classes.iconDisabled
                )}
              />
            </IconButton>
            <IconButton
              className={classes.iconContainer}
              onClick={(): void =>
                props.handleHassChange &&
                props.handleHassChange("cover", "stop_cover_tilt", {
                  entity_id: props.entity.entity_id,
                })
              }>
              <span className={clsx("mdi", "mdi-stop", classes.icon)} />
            </IconButton>
            <IconButton
              className={classes.iconContainer}
              disabled={props.entity.attributes.current_tilt_position < 1}
              onClick={(): void =>
                props.handleHassChange &&
                props.handleHassChange("cover", "close_cover_tilt", {
                  entity_id: props.entity.entity_id,
                })
              }>
              <span
                className={clsx(
                  "mdi",
                  "mdi-arrow-bottom-left",
                  classes.icon,
                  props.entity.attributes.current_tilt_position < 1 &&
                    classes.iconDisabled
                )}
              />
            </IconButton>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
}

export default Cover;
