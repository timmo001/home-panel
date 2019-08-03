// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { EntityProps } from './Entity';

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
    height: 32,
    width: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    transform: 'translateY(-8px)',
    textAlign: 'center',
    color: theme.palette.text.primary
  },
  iconDisabled: {
    opacity: 0.6
  }
}));

interface CoverProps extends EntityProps {}

function Cover(props: CoverProps) {
  const classes = useStyles();
  let entity: any, state: string | undefined, attributes: any | undefined;

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
    attributes = entity[1].attributes;
  }

  if (!entity)
    return (
      <Grid
        className={classes.root}
        container
        direction="row"
        alignContent="center"
        justify="center">
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

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justify="space-between"
      direction="column">
      <Grid
        item
        xs
        container
        alignItems="center"
        justify="space-around"
        direction="row">
        <Grid item>
          <IconButton
            className={classes.iconContainer}
            disabled={attributes.current_position > 99}
            onClick={() =>
              props.handleHassChange!('cover', 'open_cover', {
                entity_id: entity[1].entity_id
              })
            }>
            <span
              className={classnames(
                'mdi',
                'mdi-arrow-up',
                classes.icon,
                attributes.current_position > 99 && classes.iconDisabled
              )}
            />
          </IconButton>
          <IconButton
            className={classes.iconContainer}
            onClick={() =>
              props.handleHassChange!('cover', 'stop_cover', {
                entity_id: entity[1].entity_id
              })
            }>
            <span className={classnames('mdi', 'mdi-stop', classes.icon)} />
          </IconButton>
          <IconButton
            className={classes.iconContainer}
            disabled={attributes.current_position < 1}
            onClick={() =>
              props.handleHassChange!('cover', 'close_cover', {
                entity_id: entity[1].entity_id
              })
            }>
            <span
              className={classnames(
                'mdi',
                'mdi-arrow-down',
                classes.icon,
                attributes.current_position < 1 && classes.iconDisabled
              )}
            />
          </IconButton>
        </Grid>
        {attributes.current_tilt_position !== undefined &&
        props.card.width > 1 ? (
          <Grid item>
            <IconButton
              className={classes.iconContainer}
              disabled={attributes.current_tilt_position > 99}
              onClick={() =>
                props.handleHassChange!('cover', 'open_cover_tilt', {
                  entity_id: entity[1].entity_id
                })
              }>
              <span
                className={classnames(
                  'mdi',
                  'mdi-arrow-top-right',
                  classes.icon,
                  attributes.current_tilt_position > 99 && classes.iconDisabled
                )}
              />
            </IconButton>
            <IconButton
              className={classes.iconContainer}
              onClick={() =>
                props.handleHassChange!('cover', 'stop_cover_tilt', {
                  entity_id: entity[1].entity_id
                })
              }>
              <span className={classnames('mdi', 'mdi-stop', classes.icon)} />
            </IconButton>
            <IconButton
              className={classes.iconContainer}
              disabled={attributes.current_tilt_position < 1}
              onClick={() =>
                props.handleHassChange!('cover', 'close_cover_tilt', {
                  entity_id: entity[1].entity_id
                })
              }>
              <span
                className={classnames(
                  'mdi',
                  'mdi-arrow-bottom-left',
                  classes.icon,
                  attributes.current_tilt_position < 1 && classes.iconDisabled
                )}
              />
            </IconButton>
          </Grid>
        ) : null}
      </Grid>
    </Grid>
  );
}

Cover.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default Cover;
