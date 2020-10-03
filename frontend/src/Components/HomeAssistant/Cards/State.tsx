import React, { useEffect, useCallback, ReactElement, useState } from "react";
import clsx from "clsx";
import moment from "moment";
import { HassEntity } from "home-assistant-js-websocket";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { EntityProps } from "./Entity";
import { fetchHistory } from "../Utils/API";
import Chart, { ChartData } from "../../Visualisations/Chart";

const useStyles = makeStyles((theme: Theme) => ({
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
  textSecondary: {
    marginLeft: theme.spacing(0.5),
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

let historyInterval: NodeJS.Timeout;
function State(props: EntityProps): ReactElement | null {
  const [historyData, setHistoryData] = useState<ChartData[]>();

  const getHistory = useCallback(async (): Promise<void> => {
    let data;
    if (props.hassAuth && props.card.entity) {
      data = await fetchHistory(
        props.hassAuth,
        props.card.entity,
        moment().subtract(props.card.chart_from, "hours").toDate(),
        moment().toDate()
      );
      if (props.card.chart_detail && data && Array.isArray(data)) {
        if (data.length > 0) {
          const hData = data[0]
            .filter((entity: HassEntity) => !isNaN(Number(entity.state)))
            .filter((_e: HassEntity, i: number) => {
              if (props.card.chart_detail)
                return (i + 1) % props.card.chart_detail === 0;
              else return true;
            })
            .map((entity: HassEntity) => ({ value: Number(entity.state) }));
          if (hData) setHistoryData(hData);
        }
      }
    }
  }, [
    props.card.entity,
    props.hassAuth,
    props.card.chart_detail,
    props.card.chart_from,
  ]);

  useEffect(() => {
    if (props.card.chart && props.hassAuth) {
      getHistory();
      if (historyInterval) clearInterval(historyInterval);
      historyInterval = setInterval(getHistory, 60000);
      return (): void => {
        if (historyInterval) clearInterval(historyInterval);
      };
    }
  }, [
    props.card.chart,
    props.hassAuth,
    props.card.chart_detail,
    props.card.chart_from,
    getHistory,
  ]);

  const classes = useStyles();

  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      alignContent="center"
      justify="center">
      {props.card &&
        props.card.chart &&
        historyData &&
        Array.isArray(historyData) &&
        historyData.length > 0 && (
          <Chart
            labels={props.card.chart_labels}
            lowerGauge={props.card.icon ? false : true}
            data={historyData}
            type={props.card.chart}
          />
        )}
      <Grid className={classes.iconContainer} item>
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
      <Grid className={classes.textContainer} item>
        <Typography
          className={classes.text}
          color="textPrimary"
          variant={props.card.disabled ? "body2" : "body1"}
          component="span"
          style={{ fontSize: props.card.state_size }}>
          {props.entity.state}
          <span className={classes.textSecondary}>
            {props.entity.attributes.unit_of_measurement}
          </span>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default State;
