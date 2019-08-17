// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { EntityProps } from './Entity';
import properCase from '../../Utils/properCase';

const useStyles = makeStyles((_theme: Theme) => ({
  root: {
    flex: 1
  },
  text: {
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    textAlign: 'center'
  }
}));

interface StateProps extends EntityProps {}

function State(props: StateProps) {
  const classes = useStyles();
  let entity: any, state: string | undefined, icon: string | undefined;

  if (!props.hassEntities) {
    state = 'Home Assistant not connected.';
    props.card.disabled = true;
  } else
    entity = props.hassEntities.find(
      (entity: any) => entity[0] === props.card.entity
    );

  if (!entity && !state) {
    props.card.disabled = true;
    state = `${props.card.entity} not found`;
  } else if (!state) {
    props.card.disabled = false;
    state = properCase(entity[1].state);
    if (entity[1].attributes) {
      if (entity[1].attributes.icon)
        icon = entity[1].attributes.icon.replace(':', '-');
      if (entity[1].attributes.unit_of_measurement)
        state += ` ${entity[1].attributes.unit_of_measurement}`;
    }
  }
  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      alignContent="center"
      justify="center">
      <Grid className={classes.iconContainer} item xs={12}>
        {icon && (
          <Typography
            className={classnames('mdi', icon, classes.icon)}
            color="textPrimary"
            variant="h2"
            component="h5"
          />
        )}
      </Grid>
      <Grid item xs>
        <Typography
          className={classes.text}
          color="textPrimary"
          variant="body1"
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
