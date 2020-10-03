import React, { ReactElement, useCallback, Fragment } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

import { EntityProps } from "./Entity";

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: "1 1 auto",
    margin: 4,
  },
}));

function EntityAction(props: EntityProps): ReactElement | null {
  const classes = useStyles();

  const handleChange = useCallback(
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (key === "service_data") {
        let json;
        try {
          json = JSON.parse(event.target.value);
        } catch (e) {}
        if (json) {
          if (props.handleValidation)
            props.handleValidation("click_action_service_data");
        } else {
          if (props.handleValidation)
            props.handleValidation(
              "click_action_service_data",
              "Invalid JSON in Service Data"
            );
        }
      }
      if (props.handleManualChange && props.card.click_action) {
        props.handleManualChange("click_action", {
          ...props.card.click_action,
          [key]: event.target.value,
        });
      }
    },
    [props]
  );

  const handleSelectChange = useCallback(
    (key: string) => (
      event: React.ChangeEvent<{ name?: string; value: unknown }>
    ): void => {
      if (props.handleManualChange && props.card.click_action) {
        props.handleManualChange("click_action", {
          ...props.card.click_action,
          [key]: event.target.value,
        });
      }
    },
    [props]
  );

  if (!props.card.click_action) {
    if (props.handleManualChange)
      props.handleManualChange("click_action", { type: "default" });
    return null;
  }
  return (
    <Grid item xs container justify="flex-start" alignContent="center">
      <Grid item xs>
        <FormControl className={classes.textField}>
          <InputLabel htmlFor="click_action_type">Click Action</InputLabel>
          <Select
            value={props.card.click_action.type || "default"}
            onChange={handleSelectChange("type")}
            inputProps={{
              name: "click_action_type",
              id: "click_action_type",
            }}>
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="call-service">Call Service</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {props.card.click_action.type === "call-service" && (
        <Fragment>
          <Grid item xs>
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              label="Service"
              placeholder=""
              value={props.card.click_action.service || ""}
              onChange={handleChange("service")}
            />
          </Grid>
          <Grid item xs>
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              label="Service Data"
              placeholder="{}"
              multiline
              value={props.card.click_action.service_data || "{}"}
              onChange={handleChange("service_data")}
            />
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
}

export default EntityAction;
