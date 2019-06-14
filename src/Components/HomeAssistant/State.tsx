// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import properCase from '../Utils/properCase';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
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
    justifyContent: 'center'
  },
  icon: {
    textAlign: 'center',
    opacity: 0.9
  }
}));

interface StateProps {
  card: any;
  hassConfig: any;
  hassEntities: any;
}

function State(props: StateProps) {
  const classes = useStyles();
  let entity: any;
  if (!props.hassEntities) entity = 'Home Assistant not connected.';
  else
    entity = props.hassEntities.find(
      (entity: any) => entity[0] === props.card.entity
    );

  let state: string, icon: string | undefined;
  if (!entity) state = `No entity found for ${props.card.entity}`;
  else {
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
            variant="h4"
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
