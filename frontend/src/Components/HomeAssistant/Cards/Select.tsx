import React, { useState, ReactElement } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

import { EntityProps } from "./Entity";

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
  },
  textContainer: {
    zIndex: 100,
  },
  text: {
    overflow: "hidden",
    userSelect: "none",
    textAlign: "center",
    textOverflow: "ellipsis",
    zIndex: 100,
  },
  iconContainer: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  icon: {
    textAlign: "center",
  },
  menu: {
    zIndex: 2000,
  },
}));

let PopoverNode: HTMLButtonElement | null | undefined;
function Select(props: EntityProps): ReactElement {
  const [open, setOpen] = useState(false);

  function handleToggle(): void {
    setOpen(!open);
  }

  const handleChosen =
    (option: string) =>
    (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _event: React.MouseEvent<HTMLLIElement, MouseEvent>
    ): void => {
      props.handleHassChange &&
        props.handleHassChange("input_select", "select_option", {
          entity_id: props.card.entity,
          option,
        });
      setOpen(false);
    };

  const classes = useStyles();
  const theme = useTheme();

  return (
    <IconButton
      className={classes.root}
      onClick={handleToggle}
      ref={(node: HTMLButtonElement): void => {
        PopoverNode = node;
      }}>
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
        <Grid item xs className={classes.textContainer}>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant={props.card.disabled ? "body2" : "body1"}
            component="h5">
            {props.entity.state}
          </Typography>
        </Grid>
      </Grid>
      <Popover
        className={classes.menu}
        id="options"
        anchorEl={PopoverNode}
        open={open}
        onClose={handleToggle}>
        <Paper
          square
          style={{
            maxHeight: 250,
            width: PopoverNode ? PopoverNode.clientWidth : undefined,
            marginTop: theme.spacing(1),
            overflow: "auto",
          }}>
          {props.entity.attributes.options &&
            props.entity.attributes.options.map(
              (option: string, key: number) => (
                <MenuItem
                  key={key}
                  onClick={handleChosen(option)}
                  value={option}>
                  {option}
                </MenuItem>
              )
            )}
        </Paper>
      </Popover>
    </IconButton>
  );
}

export default Select;
