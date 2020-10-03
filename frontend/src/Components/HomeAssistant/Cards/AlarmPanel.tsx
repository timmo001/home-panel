import React, { ReactElement, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";

import { EntityProps } from "./Entity";
import properCase from "../../../utils/properCase";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: 1,
  },
  text: {
    marginBottom: theme.spacing(0.2),
    userSelect: "none",
    overflow: "hidden",
    textAlign: "center",
    textOverflow: "ellipsis",
  },
  input: {
    width: 60,
  },
  codes: {
    maxWidth: 168,
  },
}));

function AlarmPanel(props: EntityProps): ReactElement | null {
  const [code, setCode] = useState<string>("");

  function handleCodeChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setCode(event.target.value);
  }

  const handleCodePressed = (digit?: string) => (): void => {
    if (digit) setCode(code + digit);
    else setCode("");
  };

  const handleUpdate = (service: string) => (): void => {
    const domain = props.card.entity?.split(".")[0];
    if (props.handleHassChange && domain)
      props.handleHassChange(domain, service, {
        entity_id: props.card.entity,
        code,
      });
    setCode("");
  };

  const armed =
    props.entity.state === "armed_away" || props.entity.state === "armed_home";
  const classes = useStyles();

  return (
    <Grid
      className={classes.root}
      container
      justify="center"
      alignContent="center"
      alignItems="center"
      direction="column">
      <Grid item>
        <Typography className={classes.text} color="textPrimary" component="h5">
          {properCase(props.entity.state)}
        </Typography>
      </Grid>
      {(!props.card.width || props.card.width > 1) &&
        (!props.card.height || props.card.height > 1) && (
          <Grid
            item
            container
            spacing={1}
            alignContent="center"
            justify="center"
            direction="row">
            {!armed && (
              <Grid item>
                <Button
                  color="primary"
                  onClick={handleUpdate("alarm_arm_away")}
                  disabled={
                    (props.entity.attributes.code_arm_required && !code) ||
                    props.entity.state === "pending"
                  }>
                  Arm Away
                </Button>
              </Grid>
            )}
            {!armed && (
              <Grid item>
                <Button
                  color="primary"
                  onClick={handleUpdate("alarm_arm_home")}
                  disabled={
                    (props.entity.attributes.code_arm_required && !code) ||
                    props.entity.state === "pending"
                  }>
                  Arm Home
                </Button>
              </Grid>
            )}
            {armed && (
              <Grid item>
                <Button
                  color="primary"
                  onClick={handleUpdate("alarm_disarm")}
                  disabled={
                    (props.entity.attributes.code_arm_required && !code) ||
                    props.entity.state === "pending"
                  }>
                  Disarm
                </Button>
              </Grid>
            )}
          </Grid>
        )}
      {props.entity.attributes.code_arm_required &&
        (!props.card.width || props.card.width > 1) &&
        (!props.card.height || props.card.height > 2) && (
          <Grid item>
            <Input
              className={classes.input}
              inputProps={{
                "aria-label": "code",
                style: { textAlign: "center" },
              }}
              disabled={props.entity.state === "pending"}
              placeholder="1234"
              type="number"
              value={code || ""}
              onChange={handleCodeChange}
            />
          </Grid>
        )}
      {props.entity.attributes.code_arm_required &&
        (!props.card.width || props.card.width > 1) &&
        (!props.card.height || props.card.height > 1) && (
          <Grid
            className={classes.codes}
            item
            container
            alignContent="center"
            justify="center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((value: number) => (
              <Grid key={value} item xs={4}>
                <Button
                  size="large"
                  disabled={props.entity.state === "pending"}
                  onClick={handleCodePressed(String(value))}>
                  {value}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
    </Grid>
  );
}

export default AlarmPanel;
