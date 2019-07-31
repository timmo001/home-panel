// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';

import { EntityProps } from './Entity';

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

interface ToggleProps extends EntityProps {}

function Toggle(props: ToggleProps) {
  const classes = useStyles();
  const theme = useTheme();
  let entity: any, state: string | undefined, icon: string | undefined;
  if (!props.hassEntities) {
    state = 'Home Assistant not connected.';
    props.card.disabled = true;
  } else
    entity = props.hassEntities.find(
      (entity: any) => entity[0] === props.card.entity
    );

  if (!entity) {
    props.card.disabled = true;
    state = `${props.card.entity} not found`;
  } else if (!state) {
    props.card.disabled = false;
    state = entity[1].state;
    props.card.state = state;
    props.card.toggleable = state === 'unavailable' ? false : true;
    props.card.background =
      state === 'unavailable'
        ? grey[600]
        : state === 'on'
        ? theme.palette.primary.main
        : theme.palette.background.paper;
    if (entity[1].attributes) {
      if (entity[1].attributes.icon)
        icon = entity[1].attributes.icon.replace(':', '-');
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
      {props.card.disabled && (
        <Grid item xs>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant="body1"
            component="h5">
            {state}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

Toggle.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default Toggle;
