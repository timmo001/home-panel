import React, { useEffect, ReactElement, useState } from "react";
import clsx from "clsx";
import { ColorResult, HuePicker } from "react-color";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import grey from "@material-ui/core/colors/grey";

import { EntityProps } from "./Entity";
import FeatureClassNames from "../Utils/FeatureClassNames";

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
    height: 48,
    width: 48,
    textAlign: "center",
    verticalAlign: "center",
  },
  select: {
    minWidth: "100%",
    width: "100%",
  },
}));

const FEATURE_CLASS_NAMES = {
  1: "has-brightness",
  2: "has-color_temp",
  4: "has-effect_list",
  16: "has-color",
  128: "has-white_value",
};

function Light(props: EntityProps): ReactElement | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [attributes, setAttributes] = useState<{ [key: string]: any }>();
  const [color, setColor] = useState("");

  const classes = useStyles();
  const theme = useTheme();

  const attrClasses = FeatureClassNames(props.entity, FEATURE_CLASS_NAMES);

  useEffect(() => {
    if (props.entity) {
      setAttributes(props.entity.attributes);
      setColor(
        props.entity.state === "unavailable"
          ? grey[600]
          : props.entity.state === "on"
          ? props.entity.attributes.rgb_color
            ? `rgb(${props.entity.attributes.rgb_color.join(",")})`
            : theme.palette.primary.main
          : theme.palette.text.primary
      );
    }
  }, [props.entity, theme.palette.primary.main, theme.palette.text.primary]);

  const getText = (value: number): string => `${value}`;

  const handleSliderChange =
    (name: string) =>
    (_event: React.ChangeEvent<unknown>, value: number | number[]): void => {
      setAttributes({ ...attributes, [name]: value });
    };

  const handleSliderChangeComplete =
    (name: string) =>
    (_event: React.ChangeEvent<unknown>, value: number | number[]): void => {
      props.handleHassChange &&
        props.handleHassChange("light", true, {
          entity_id: props.entity.entity_id,
          [name]: value,
        });
    };

  function handleColorChange(color: ColorResult): void {
    setAttributes({
      ...attributes,
      rgb_color: [color.rgb.r, color.rgb.g, color.rgb.b],
    });
    props.handleHassChange &&
      props.handleHassChange("light", true, {
        entity_id: props.entity.entity_id,
        rgb_color: [color.rgb.r, color.rgb.g, color.rgb.b],
      });
  }

  const handleSelectChange =
    (name: string) =>
    (
      event: React.ChangeEvent<{ name?: string; value: unknown }>,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _child: React.ReactNode
    ): void => {
      setAttributes({ ...attributes, [name]: event.target.value });
      props.handleHassChange &&
        props.handleHassChange("light", true, {
          entity_id: props.entity.entity_id,
          [name]: event.target.value,
        });
    };

  const controls: Array<ReactElement> = [];

  if (attrClasses.includes("has-brightness"))
    controls.push(
      <Grid key={0} item xs={10}>
        <Typography id="discrete-slider" gutterBottom>
          Brightness
        </Typography>
        <Slider
          onChange={handleSliderChange("brightness_pct")}
          onChangeCommitted={handleSliderChangeComplete("brightness_pct")}
          value={
            attributes
              ? attributes.brightness_pct
                ? attributes.brightness_pct
                : attributes.brightness
                ? (attributes.brightness / 255) * 100
                : 0
              : 0
          }
          getAriaValueText={getText}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          min={0}
          max={100}
        />
      </Grid>
    );
  if (attrClasses.includes("has-color_temp") && props.entity.state === "on")
    controls.push(
      <Grid key={1} item xs={10}>
        <Typography id="discrete-slider" gutterBottom>
          Color Temperature
        </Typography>
        <Slider
          onChange={handleSliderChange("color_temp")}
          onChangeCommitted={handleSliderChangeComplete("color_temp")}
          value={attributes ? attributes.color_temp : 0}
          getAriaValueText={getText}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          min={attributes ? attributes.min_mireds : 0}
          max={attributes ? attributes.max_mireds : 0}
        />
      </Grid>
    );
  if (attrClasses.includes("has-white_value") && props.entity.state === "on")
    controls.push(
      <Grid key={2} item xs={10}>
        <Typography id="discrete-slider" gutterBottom>
          White Value
        </Typography>
        <Slider
          onChange={handleSliderChange("white_value")}
          onChangeCommitted={handleSliderChangeComplete("white_value")}
          value={attributes ? attributes.white_value : 0}
          getAriaValueText={getText}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          min={0}
          max={255}
        />
      </Grid>
    );
  if (attrClasses.includes("has-color") && props.entity.state === "on")
    controls.push(
      <Grid key={3} item xs={10}>
        <HuePicker
          color={color}
          width="200"
          onChangeComplete={handleColorChange}
        />
      </Grid>
    );
  if (attrClasses.includes("has-effect_list") && props.entity.state === "on")
    controls.push(
      <Grid key={4} item xs={10}>
        <FormControl>
          <InputLabel htmlFor="effect">Effect</InputLabel>
          <Select
            className={classes.select}
            value={attributes && attributes.effect ? attributes.effect : "none"}
            onChange={handleSelectChange("effect")}
            inputProps={{
              name: "effect",
              id: "effect",
            }}>
            <MenuItem value="none">None</MenuItem>
            {attributes &&
              attributes.effect_list &&
              attributes.effect_list.map((effect: string, key: number) => (
                <MenuItem key={key} value={effect}>
                  {effect}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
    );

  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      alignContent="center"
      justify="center"
      spacing={1}>
      <Grid className={classes.iconContainer} item xs={10}>
        <IconButton
          disabled={props.card.click_action?.type === "call-service"}
          onClick={props.handleHassToggle}>
          <Typography
            className={clsx(
              "mdi",
              `mdi-${props.card.icon || "lightbulb"}`,
              classes.icon
            )}
            style={{ color, fontSize: props.card.icon_size }}
            variant="h3"
            component="h5"
          />
        </IconButton>
      </Grid>
      {props.card.disabled && (
        <Grid item xs={10}>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant={props.card.disabled ? "body2" : "body1"}
            component="h5">
            {props.entity.state}
          </Typography>
        </Grid>
      )}
      {!props.card.height || props.card.height > 3
        ? controls
        : controls
            .splice(
              0,
              Number(props.card.height) > 1 ? Number(props.card.height) : 0
            )
            .map((control) => control)}
    </Grid>
  );
}

export default Light;
