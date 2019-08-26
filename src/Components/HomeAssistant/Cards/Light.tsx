// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HassEntity } from 'home-assistant-js-websocket';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';

import { EntityProps } from './Entity';
import featureClassNames from '../Utils/featureClassNames';

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
    height: 64,
    width: 64,
    textAlign: 'center',
    verticalAlign: 'center'
  }
}));

const FEATURE_CLASS_NAMES = {
  1: 'has-brightness',
  2: 'has-color_temp',
  4: 'has-effect_list',
  16: 'has-color',
  128: 'has-white_value'
};

interface LightProps extends EntityProps {}

function Light(props: LightProps) {
  const classes = useStyles();
  const theme = useTheme();
  let entity: any,
    state: string | undefined,
    attributes: any,
    attrClasses: string[],
    color: string = '';
  if (!props.hassEntities) {
    state = 'Home Assistant not connected.';
    props.card.disabled = true;
  } else
    entity = props.hassEntities.find(
      (entity: HassEntity) => entity.entity_id === props.card.entity
    );

  if (!entity && !state) {
    props.card.disabled = true;
    state = `${props.card.entity} not found`;
  } else if (!state) {
    props.card.disabled = false;
    state = entity[1].state;
    props.card.state = state;
    attributes = entity[1].attributes;
    console.log(attributes);

    attrClasses = [featureClassNames(entity, FEATURE_CLASS_NAMES)];
    if (entity && entity.state === 'on') {
      attrClasses.push('is-on');
    }
    if (entity && entity.state === 'unavailable') {
      attrClasses.push('is-unavailable');
    }

    console.table(attrClasses);

    color =
      state === 'unavailable'
        ? grey[600]
        : state === 'on'
        ? attributes.rgb_color
          ? `rgb(${attributes.rgb_color.join(',')})`
          : theme.palette.primary.main
        : theme.palette.text.primary;
  }
  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      alignContent="center"
      justify="center">
      <Grid className={classes.iconContainer} item xs={12}>
        <IconButton onClick={props.handleHassToggle}>
          <Typography
            className={classnames(
              'mdi',
              `mdi-${props.card.icon || 'lightbulb'}`,
              classes.icon
            )}
            style={{ color }}
            variant="h2"
            component="h5"
          />
        </IconButton>
      </Grid>
      {props.card.disabled ? (
        <Grid item xs>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant="body1"
            component="h5">
            {state}
          </Typography>
        </Grid>
      ) : (
        <Grid item xs></Grid>
      )}
    </Grid>
  );
}

Light.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any,
  handleHassToggle: PropTypes.func.isRequired
};

export default Light;
