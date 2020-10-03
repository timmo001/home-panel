import React, { ReactElement, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

import { EntityProps } from "./Entity";

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
  },
  textContainer: {
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
}));

function NumberEntity(props: EntityProps): ReactElement {
  const [number, setNumber] = useState<number>();

  function handleSliderChange(
    _event: React.ChangeEvent<unknown>,
    value: number | number[]
  ): void {
    setNumber(Array.isArray(value) ? value[0] : value);
  }

  function handleSliderChangeComplete(
    _event: React.ChangeEvent<unknown>,
    value: number | number[]
  ): void {
    props.handleHassChange &&
      props.handleHassChange("input_number", "set_value", {
        entity_id: props.entity.entity_id,
        value,
      });
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const val = Number(event.target.value);
    setNumber(!val ? 0 : val);
    props.handleHassChange &&
      props.handleHassChange("input_number", "set_value", {
        entity_id: props.entity.entity_id,
        value: val,
      });
  }

  function handleBlur(): void {
    if (props.entity.attributes && number)
      if (number < props.entity.attributes.max) {
        setNumber(Number(props.entity.attributes.min));
      } else if (number > props.entity.attributes.max) {
        setNumber(Number(props.entity.attributes.max));
      }
  }

  const classes = useStyles();

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
      {number && (
        <Grid
          className={classes.textContainer}
          item
          container
          direction="row"
          alignContent="center"
          justify="center">
          {props.entity.attributes &&
          props.entity.attributes.mode === "slider" ? (
            <Grid item xs>
              <Slider
                onChange={handleSliderChange}
                onChangeCommitted={handleSliderChangeComplete}
                value={number || 0}
                getAriaValueText={(value: number): string => `${value}`}
                aria-labelledby="input-slider"
                valueLabelDisplay="auto"
                step={
                  props.entity.attributes ? props.entity.attributes.step : 1
                }
                min={props.entity.attributes ? props.entity.attributes.min : 0}
                max={
                  props.entity.attributes ? props.entity.attributes.max : 100
                }
              />
            </Grid>
          ) : (
            <Grid item>
              <Input
                value={number || 0}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: props.entity.attributes
                    ? props.entity.attributes.step
                    : 1,
                  min: props.entity.attributes
                    ? props.entity.attributes.min
                    : 0,
                  max: props.entity.attributes
                    ? props.entity.attributes.max
                    : 100,
                  type: "number",
                  "aria-labelledby": "input-slider",
                }}
              />
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default NumberEntity;
