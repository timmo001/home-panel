import React, { ReactElement, Fragment } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { BaseProps } from "./Base";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  heading: {
    marginTop: theme.spacing(2),
  },
  textField: {
    width: "calc(100% - 8px)",
    margin: 4,
  },
}));

function Frame(props: BaseProps): ReactElement {
  const classes = useStyles();

  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography
          className={classes.heading}
          variant="subtitle1"
          gutterBottom>
          Frame Configuration
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
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            label="URL"
            placeholder="https://home-panel-docs.timmo.dev"
            value={props.card.url || ""}
            onChange={props.handleChange && props.handleChange("url")}
          />
        </Grid>
        <Grid item xs>
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            label="Height"
            placeholder="auto"
            value={props.card.height || "auto"}
            onChange={props.handleChange && props.handleChange("height")}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default Frame;
