// @flow
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { HassEntity } from 'home-assistant-js-websocket';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { EntityProps } from './Entity';
import { fetchHistory } from '../Utils/api';
import Chart from '../../Visualisations/Chart';
import properCase from '../../Utils/properCase';

const useStyles = makeStyles((_theme: Theme) => ({
  root: {
    flex: 1
  },
  textContainer: {
    zIndex: 100
  },
  text: {
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    zIndex: 100
  },
  iconContainer: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  icon: {
    textAlign: 'center'
  }
}));

interface StateProps extends EntityProps {}

let historyInterval: NodeJS.Timeout;
function State(props: StateProps) {
  const [historyData, setHistoryData] = React.useState();

  const classes = useStyles();
  const theme = useTheme();
  let entity: HassEntity | undefined, state: string | undefined;

  if (!props.hassEntities) {
    state = 'Home Assistant not connected.';
    props.card.disabled = true;
  } else entity = props.hassEntities[props.card.entity!];

  if (!entity && !state) {
    props.card.disabled = true;
    state = `${props.card.entity} not found`;
  } else if (!state) {
    props.card.disabled = false;
    state = properCase(entity!.state);
    if (entity!.attributes) {
      if (entity!.attributes.unit_of_measurement)
        state += ` ${entity!.attributes.unit_of_measurement}`;
    }
  }

  const getHistory = useCallback(async () => {
    const data = await fetchHistory(
      props.hassAuth,
      props.card.entity!,
      moment()
        .subtract(props.card.chart_from, 'hours')
        .toDate(),
      moment().toDate()
    );
    if (Array.isArray(data)) {
      const hData = data[0]
        .filter((entity: HassEntity) => !isNaN(Number(entity.state)))
        .filter((_e: HassEntity, i: number) => {
          return (i + 1) % props.card.chart_detail! === 0;
        })
        .map((entity: HassEntity) => Number(entity.state));
      if (hData) setHistoryData(hData);
    }
  }, [
    props.card.entity,
    props.hassAuth,
    props.card.chart_detail,
    props.card.chart_from
  ]);

  useEffect(() => {
    if (props.card.chart && props.hassAuth) {
      getHistory();
      if (historyInterval) clearInterval(historyInterval);
      historyInterval = setInterval(getHistory, 60000);
      return () => {
        if (historyInterval) clearInterval(historyInterval);
      };
    }
  }, [
    props.card.chart,
    props.hassAuth,
    props.card.chart_detail,
    props.card.chart_from,
    getHistory
  ]);

  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      alignContent="center"
      justify="center">
      {props.card &&
        props.card.chart &&
        historyData &&
        historyData.length > 0 && (
          <Chart
            color={theme.palette.secondary.dark}
            lowerGauge={props.card.icon ? false : true}
            series={
              props.card.chart === 'radialBar'
                ? [historyData[historyData.length - 1]]
                : [{ data: historyData }]
            }
            type={props.card.chart}
          />
        )}
      <Grid className={classes.iconContainer} item xs={12}>
        {props.card.icon && (
          <Typography
            className={classnames(
              'mdi',
              `mdi-${props.card.icon}`,
              classes.icon
            )}
            color="textPrimary"
            variant="h3"
            component="h5"
          />
        )}
      </Grid>
      <Grid item xs className={classes.textContainer}>
        <Typography
          className={classes.text}
          color="textPrimary"
          variant={props.card.disabled ? 'body2' : 'body1'}
          component="h5">
          {state}
        </Typography>
      </Grid>
    </Grid>
  );
}

State.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default State;
