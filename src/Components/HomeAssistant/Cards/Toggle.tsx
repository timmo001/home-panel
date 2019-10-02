// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HassEntity } from 'home-assistant-js-websocket';
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
    userSelect: 'none',
    textAlign: 'center',
    textOverflow: 'ellipsis'
  },
  iconContainer: {
    display: 'flex',
    alignContent: 'center',
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
    state = entity!.state;
    props.card.state = state;
    props.card.toggleable = state === 'unavailable' ? false : true;
    props.card.backgroundTemp =
      state === 'unavailable'
        ? grey[600]
        : state === 'on' || state === 'locked'
        ? theme.palette.primary.main
        : props.card.background;
  }
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
      {props.card.disabled && (
        <Grid item xs>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant={props.card.disabled ? 'body2' : 'body1'}
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
