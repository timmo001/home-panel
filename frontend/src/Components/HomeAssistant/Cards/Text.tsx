import React, { useEffect, ReactElement, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
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

function TextEntity(props: EntityProps): ReactElement {
  const [text, setText] = useState<string>();

  useEffect(() => {
    setText(props.entity.state);
  }, [props.entity.state]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (props.handleHassChange) {
      const val = event.target.value;
      setText(String(!val ? 0 : val));
      props.handleHassChange("input_text", "set_value", {
        entity_id: props.entity.entity_id,
        value: val,
      });
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
      {text && (
        <Grid
          className={classes.textContainer}
          item
          container
          direction="row"
          alignContent="center"
          justify="center">
          <Grid item>
            <Input
              value={text || ""}
              margin="dense"
              onChange={handleInputChange}
              inputProps={{
                type: "text",
              }}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default TextEntity;
