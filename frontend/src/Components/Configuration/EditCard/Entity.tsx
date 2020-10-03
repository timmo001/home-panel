import React, { ReactElement, Fragment } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { BaseProps } from "./Base";
import { chartTypes } from "../../Visualisations/Chart";
import { HomeAssistantEntityProps } from "../../HomeAssistant/HomeAssistant";
import EntitySelect from "../../HomeAssistant/Utils/EntitySelect";
import EntityAction from "./EntityAction";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  heading: {
    marginTop: theme.spacing(2),
  },
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: "1 1 auto",
    margin: 4,
  },
  switch: {
    margin: 4,
  },
}));

export interface EntityProps extends BaseProps, HomeAssistantEntityProps {}

function Entity(props: EntityProps): ReactElement {
  function handleGetEntityIcon(): void {
    if (props.card.entity && props.handleManualChange) {
      const entity = props.hassEntities[props.card.entity];
      if (entity && entity.attributes.icon)
        props.handleManualChange(
          "icon",
          entity.attributes.icon.replace("mdi:", "")
        );
    }
  }

  const classes = useStyles();
  const domain = props.card.entity && props.card.entity.split(".")[0].trim();

  let iconAllowed = false,
    graphAllowed = false;
  if (
    domain === "air_quality" ||
    domain === "binary_sensor" ||
    domain === "device_tracker" ||
    domain === "geo_location" ||
    domain === "group" ||
    domain === "input_boolean" ||
    domain === "input_text" ||
    domain === "input_number" ||
    domain === "input_select" ||
    domain === "light" ||
    domain === "lock" ||
    domain === "remote" ||
    domain === "scene" ||
    domain === "script" ||
    domain === "sensor" ||
    domain === "sun" ||
    domain === "switch"
  )
    iconAllowed = true;

  if (
    domain === "air_quality" ||
    domain === "binary_sensor" ||
    domain === "device_tracker" ||
    domain === "geo_location" ||
    domain === "sensor" ||
    domain === "sun"
  )
    graphAllowed = true;

  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography
          className={classes.heading}
          variant="subtitle1"
          gutterBottom>
          Entity Configuration
        </Typography>
        <Divider variant="fullWidth" />
      </Grid>
      <Grid
        className={classes.container}
        container
        direction="row"
        justify="center"
        alignItems="flex-end"
        alignContent="flex-end"
        item
        xs>
        <Grid item xs>
          {props.hassEntities ? (
            <EntitySelect
              {...props}
              entity={props.card.entity}
              handleChange={(value?: string): void =>
                props.handleManualChange &&
                props.handleManualChange("entity", value)
              }
            />
          ) : (
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              label="Entity"
              placeholder="sensor.myamazingsensor"
              value={props.card.entity || ""}
              onChange={props.handleChange && props.handleChange("entity")}
            />
          )}
        </Grid>
        {iconAllowed && (
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignItems="flex-end"
            alignContent="flex-end">
            <Grid item xs>
              <TextField
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
                label="Icon"
                placeholder="thermometer"
                value={props.card.icon || ""}
                onChange={props.handleChange && props.handleChange("icon")}
              />
            </Grid>
            {props.card.entity && (
              <Grid item>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleGetEntityIcon}>
                  Get from HA
                </Button>
              </Grid>
            )}
          </Grid>
        )}
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="flex-end"
          alignContent="flex-end">
          {iconAllowed && props.card.icon && (
            <Grid item xs container justify="flex-start" alignContent="center">
              <TextField
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
                type="text"
                label="Icon Size"
                placeholder="initial"
                value={props.card.icon_size || "initial"}
                onChange={props.handleChange && props.handleChange("icon_size")}
              />
            </Grid>
          )}
          {graphAllowed && props.card.entity && (
            <Grid item xs container justify="flex-start" alignContent="center">
              <TextField
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
                type="text"
                label="State Font Size"
                placeholder="initial"
                value={props.card.state_size || "initial"}
                onChange={
                  props.handleChange && props.handleChange("state_size")
                }
              />
            </Grid>
          )}
        </Grid>
        {graphAllowed && props.card.entity && (
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignContent="stretch">
            <Grid item xs>
              <FormControl className={classes.textField}>
                <InputLabel htmlFor="chart">Chart</InputLabel>
                <Select
                  value={props.card.chart || ""}
                  onChange={props.handleSelectChange}
                  inputProps={{
                    name: "chart",
                    id: "chart",
                  }}>
                  <MenuItem value="">None</MenuItem>
                  {Object.keys(chartTypes).map((chart: string, key: number) => (
                    <MenuItem key={key} value={chart}>
                      {chartTypes[chart]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
        {graphAllowed && props.card.entity && (
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignContent="stretch"
            alignItems="flex-end">
            {props.card.chart && props.card.chart !== "radialBar" && (
              <Grid item xs>
                <FormControl className={classes.textField}>
                  <InputLabel htmlFor="chart_detail">Chart Detail</InputLabel>
                  <Select
                    value={props.card.chart_detail || 3}
                    onChange={props.handleSelectChange}
                    inputProps={{
                      name: "chart_detail",
                      id: "chart_detail",
                    }}>
                    <MenuItem value={18}>Lower</MenuItem>
                    <MenuItem value={12}>Low</MenuItem>
                    <MenuItem value={6}>Medium</MenuItem>
                    <MenuItem value={4}>High</MenuItem>
                    <MenuItem value={2}>Higher</MenuItem>
                    <MenuItem value={1}>Everything</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            {props.card.chart && props.card.chart !== "radialBar" && (
              <Grid item xs>
                <TextField
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="Chart Hours From"
                  placeholder="6"
                  inputProps={{
                    autoComplete: "off",
                    min: 1,
                    max: 48,
                  }}
                  value={props.card.chart_from || "6"}
                  onChange={
                    props.handleChange && props.handleChange("chart_from")
                  }
                />
              </Grid>
            )}
            {props.card.chart && props.card.chart !== "radialBar" && (
              <Grid item xs>
                <FormControlLabel
                  className={classes.switch}
                  label="Chart Labels?"
                  labelPlacement="start"
                  control={
                    <Switch
                      color="primary"
                      defaultChecked={props.card.chart_labels}
                    />
                  }
                  onChange={
                    props.handleSwitchChange &&
                    props.handleSwitchChange("chart_labels")
                  }
                />
              </Grid>
            )}
          </Grid>
        )}
        <EntityAction {...props} />
      </Grid>
    </Fragment>
  );
}

export default Entity;
