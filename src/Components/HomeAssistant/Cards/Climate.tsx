// @flow
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

import { EntityProps } from './Entity';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    top: theme.spacing(3),
    bottom: 0
  },
  text: {
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis'
  },
  temperature: {
    display: 'inline-flex',
    marginLeft: theme.spacing(1)
  },
  icon: {
    color: theme.palette.text.primary,
    opacity: 0.6,
    textAlign: 'center'
  },
  iconActive: {
    opacity: 1.0,
    color: theme.palette.primary.main
  },
  hyphen: {
    marginLeft: theme.spacing(1)
  }
}));

interface ClimateProps extends EntityProps {}

function Climate(props: ClimateProps) {
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
    state = entity[1].state;
    attributes = entity[1].attributes;
    props.card.state = state;
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

  function handleTempChange(type: string, newTemp: number) {
    if (newTemp <= attributes.max_temp && newTemp >= attributes.min_temp) {
      const data = {
        entity_id: entity[1].entity_id,
        [type]: newTemp
      };
      if (type === 'target_temp_low')
        data.target_temp_high = attributes.target_temp_high;
      else if (type === 'target_temp_high')
        data.target_temp_low = attributes.target_temp_low;
      props.handleHassChange!('climate', 'set_temperature', data);
    }
  }

  function handleHvacChange(hvac_mode: string) {
    props.handleHassChange!('climate', 'set_hvac_mode', {
      entity_id: entity[1].entity_id,
      hvac_mode
    });
  }

  function handleAwayToggle() {
    props.handleHassChange!('climate', 'set_away_mode', {
      entity_id: entity[1].entity_id,
      away_mode: attributes.away_mode === 'on' ? 'off' : 'on'
    });
  }

  return (
    <Grid
      className={classes.root}
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
          <div className={classes.temperature}>
            <Typography variant="h4">
              {attributes.current_temperature}
            </Typography>
            <Typography variant="subtitle1">
              {props.hassConfig.unit_system.temperature}
            </Typography>
          </div>
        </Grid>
        {props.card.width > 1 && (
          <Grid item>
            {attributes.temperature ? (
              <Grid container alignItems="center" direction="column">
                <IconButton
                  onClick={() =>
                    handleTempChange(
                      'temperature',
                      attributes.temperature + 0.5
                    )
                  }>
                  <KeyboardArrowUp fontSize="small" />
                </IconButton>
                <div className={classes.temperature}>
                  <Typography variant="h5">{attributes.temperature}</Typography>
                  <Typography variant="body1">
                    {props.hassConfig.unit_system.temperature}
                  </Typography>
                </div>
                <IconButton
                  onClick={() =>
                    handleTempChange(
                      'temperature',
                      attributes.temperature - 0.5
                    )
                  }>
                  <KeyboardArrowDown fontSize="small" />
                </IconButton>
              </Grid>
            ) : (
              <Grid
                item
                container
                spacing={1}
                alignItems="center"
                direction="row">
                <Grid item xs container alignItems="center" direction="column">
                  <IconButton
                    onClick={() =>
                      handleTempChange(
                        'target_temp_low',
                        attributes.target_temp_low + 0.5
                      )
                    }>
                    <KeyboardArrowUp fontSize="small" />
                  </IconButton>
                  <div className={classes.temperature}>
                    <Typography variant="h5">
                      {attributes.target_temp_low}
                    </Typography>
                    <Typography variant="body1">
                      {props.hassConfig.unit_system.temperature}
                    </Typography>
                  </div>
                  <IconButton
                    onClick={() =>
                      handleTempChange(
                        'target_temp_low',
                        attributes.target_temp_low - 0.5
                      )
                    }>
                    <KeyboardArrowDown fontSize="small" />
                  </IconButton>
                </Grid>
                <Grid item xs className={classes.hyphen}>
                  <Typography variant="h5">-</Typography>
                </Grid>
                <Grid item xs container alignItems="center" direction="column">
                  <IconButton
                    onClick={() =>
                      handleTempChange(
                        'target_temp_high',
                        attributes.target_temp_high + 0.5
                      )
                    }>
                    <KeyboardArrowUp fontSize="small" />
                  </IconButton>
                  <div className={classes.temperature}>
                    <Typography variant="h5">
                      {attributes.target_temp_high}
                    </Typography>
                    <Typography variant="body1">
                      {props.hassConfig.unit_system.temperature}
                    </Typography>
                  </div>
                  <IconButton
                    onClick={() =>
                      handleTempChange(
                        'target_temp_high',
                        attributes.target_temp_high - 0.5
                      )
                    }>
                    <KeyboardArrowDown fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
      {props.card.width > 1 && props.card.height > 1 && (
        <Grid
          item
          container
          alignItems="center"
          justify="center"
          direction="row">
          {attributes.hvac_modes.map((mode: any, key: number) => {
            let icon: string | undefined =
              mode === 'off'
                ? 'mdi-power'
                : mode === 'heat'
                ? 'mdi-fire'
                : mode === 'cool'
                ? 'mdi-snowflake'
                : mode === 'heat_cool'
                ? 'mdi-autorenew'
                : mode === 'auto'
                ? 'mdi-calendar-repeat'
                : mode === 'dry'
                ? 'mdi-water-percent'
                : mode === 'fan_only'
                ? 'mdi-fan'
                : undefined;
            if (icon)
              return (
                <Grid key={key} item>
                  <IconButton onClick={() => handleHvacChange(mode)}>
                    <span
                      className={classnames(
                        'mdi',
                        icon,
                        classes.icon,
                        attributes.hvac_action === mode && classes.iconActive
                      )}
                    />
                  </IconButton>
                </Grid>
              );
            return (
              <Grid key={key} item>
                <Button
                  className={classnames(
                    attributes.hvac_action === mode && classes.iconActive
                  )}
                  onClick={() => handleHvacChange(mode)}>
                  {mode}
                </Button>
              </Grid>
            );
          })}
          {attributes.away_mode && (
            <Grid
              item
              xs={4}
              container
              spacing={1}
              alignItems="center"
              justify="space-around"
              direction="row">
              <Grid item>
                <IconButton onClick={() => handleAwayToggle()}>
                  <span
                    className={classnames(
                      'mdi',
                      'mdi-walk',
                      classes.icon,
                      attributes.away_mode === 'on' && classes.iconActive
                    )}
                  />
                </IconButton>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
}

Climate.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default Climate;
