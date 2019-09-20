// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HassEntity } from 'home-assistant-js-websocket';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { EntityProps } from './Entity';
import properCase from '../../Utils/properCase';
import Chart from '../../Visualisations/Chart';

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

function State(props: StateProps) {
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
  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      alignContent="center"
      justify="center">
      {props.card.chart && (
        <Chart
          color={theme.palette.secondary.dark}
          series={[{ data: [0, 20, 23, 45, 67, 96] }]}
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
