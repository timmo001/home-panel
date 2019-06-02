// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import properCase from '../Utils/properCase';

const useStyles = makeStyles((theme: Theme) => ({
  text: {
    width: '100%',
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    fontSize: '1.12rem',
    lineHeight: '1.34rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      lineHeight: '1.14rem'
    }
  },
  icon: {
    marginRight: theme.spacing(0.5)
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
    <Typography
      className={classes.text}
      color="textPrimary"
      variant="subtitle1"
      component="span">
      {icon && <span className={classnames('mdi', icon, classes.icon)} />}
      {state}
    </Typography>
  );
}

State.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default State;
