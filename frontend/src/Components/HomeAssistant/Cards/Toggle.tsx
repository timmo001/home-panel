import React, { ReactElement } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import grey from "@material-ui/core/colors/grey";

import { EntityProps } from "./Entity";

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
  iconContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  icon: {
    textAlign: "center",
  },
}));

function Toggle(props: EntityProps): ReactElement {
  const classes = useStyles();
  const theme = useTheme();

  props.card.toggleable = props.entity.state === "unavailable" ? false : true;
  props.card.backgroundTemp =
    props.entity.state === "unavailable"
      ? grey[600]
      : props.entity.state === "on" || props.entity.state === "locked"
      ? theme.palette.primary.main
      : props.card.background;

  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      alignContent="center"
      justify="center">
      <Grid className={classes.iconContainer} item xs={12}>
        {props.card.icon && (
          <Typography
            className={clsx("mdi", `mdi-${props.card.icon}`, classes.icon)}
            color="textPrimary"
            variant="h3"
            component="h5"
            style={{ fontSize: props.card.icon_size }}
          />
        )}
      </Grid>
      {props.card.disabled && (
        <Grid item xs>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant={props.card.disabled ? "body2" : "body1"}
            component="h5">
            {props.entity.state}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default Toggle;
