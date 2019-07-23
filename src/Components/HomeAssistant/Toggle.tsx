// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';

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

interface ToggleProps {
  card: any;
  hassConfig: any;
  hassEntities: any;
}

function Toggle(props: ToggleProps) {
  const classes = useStyles();
  const theme = useTheme();
  let entity: any;
  if (!props.hassEntities) entity = 'Home Assistant not connected.';
  else
    entity = props.hassEntities.find(
      (entity: any) => entity[0] === props.card.entity
    );

  let state: string, icon: string | undefined;
  if (!entity) state = `No entity found for ${props.card.entity}`;
  else {
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
    </Grid>
  );
}

Toggle.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default Toggle;
