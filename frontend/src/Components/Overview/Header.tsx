import React, { ReactElement, useMemo } from "react";
import moment from "moment";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { ConfigProps } from "../Configuration/Config";
import { HomeAssistantChangeProps } from "../HomeAssistant/HomeAssistant";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(0.5),
    },
  },
  date: {
    fontSize: "2.4rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "2.0rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.6rem",
    },
  },
  time: {
    lineHeight: 1,
  },
  timePeriod: {
    marginLeft: theme.spacing(1),
    fontSize: "2.4rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "2.0rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.6rem",
    },
  },
}));

interface HeaderProps extends ConfigProps, HomeAssistantChangeProps {}

function Header(props: HeaderProps): ReactElement | null {
  const classes = useStyles();

  const momentDate = moment();
  const timeLocation = props.config.header.time_location;
  const dateLocation = props.config.header.date_location;
  const timeFormat = useMemo(() => {
    let format = props.config.header.time_military ? "HH:mm" : "hh:mm_-_a";

    if (timeLocation === dateLocation && props.config.header.date_show)
      format += `-_-${props.config.header.date_format}`;

    return format;
  }, [
    props.config.header.date_format,
    props.config.header.date_show,
    props.config.header.time_military,
    dateLocation,
    timeLocation,
  ]);

  const timeRows = useMemo(() => {
    return momentDate
      .format(timeFormat)
      .split("-_-")
      .map((timeColumn: string) => timeColumn.split("_-_"));
  }, [momentDate, timeFormat]);

  const time = props.config.header.time_show && (
    <Typography
      className={classes.time}
      color="textPrimary"
      variant="h2"
      component="h2"
      noWrap
      style={{ fontSize: props.config.header.time_font_size }}>
      {timeRows[0][0]}
      {timeRows[0][1] && (
        <span
          className={classes.timePeriod}
          style={{ fontSize: props.config.header.time_period_font_size }}>
          {timeRows[0][1]}
        </span>
      )}
      <br />
      {timeRows[1] && <span className={classes.date}>{timeRows[1][0]}</span>}
    </Typography>
  );

  const date = props.config.header.date_show && (
    <Typography
      color="textPrimary"
      variant="h2"
      component="h2"
      noWrap
      style={{ fontSize: props.config.header.date_font_size }}>
      {moment().format(props.config.header.date_format)}
    </Typography>
  );

  const columns: (string | boolean | ReactElement)[] = useMemo(() => {
    const cols: (string | boolean | ReactElement)[] = ["", "", ""];
    cols[timeLocation] = time;
    if (timeLocation !== dateLocation || !props.config.header.time_show)
      cols[dateLocation] = date;
    return cols;
  }, [props.config.header.time_show, date, dateLocation, time, timeLocation]);

  if (!props.config.header.time_show && !props.config.header.date_show)
    return null;

  return (
    <Grid
      className={classes.root}
      item
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      spacing={2}>
      {columns.map((columnData, key: number) => (
        <Grid
          key={key}
          item
          xs
          style={{
            textAlign: key === 2 ? "end" : key === 1 ? "center" : "start",
          }}>
          {columnData}
        </Grid>
      ))}
    </Grid>
  );
}

export default Header;
