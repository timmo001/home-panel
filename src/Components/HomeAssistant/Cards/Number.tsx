import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HassEntity } from 'home-assistant-js-websocket';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

import { EntityProps } from './Entity';

const useStyles = makeStyles(() => ({
  root: {
    flex: 1
  },
  textContainer: {
    zIndex: 100
  },
  text: {
    overflow: 'hidden',
    userSelect: 'none',
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

function NumberEntity(props: EntityProps) {
  const [number, setNumber] = React.useState<number>();

  const classes = useStyles();
  let entity: HassEntity | undefined,
    state: string | undefined,
    attributes: { [key: string]: any } | undefined;

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
    attributes = entity!.attributes;
  }

  useEffect(() => {
    if (entity) setNumber(Number(entity.state));
  }, [entity]);

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
            variant="body2"
            component="h5">
            {state}
          </Typography>
        </Grid>
      </Grid>
    );

  const getText = (value: number) => `${value}`;

  function handleSliderChange(
    _event: React.ChangeEvent<{}>,
    value: number | number[]
  ) {
    setNumber(Array.isArray(value) ? value[0] : value);
  }

  function handleSliderChangeComplete(
    _event: React.ChangeEvent<{}>,
    value: number | number[]
  ) {
    props.handleHassChange!('input_number', 'set_value', {
      entity_id: entity!.entity_id,
      value
    });
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(event.target.value);
    setNumber(!val ? 0 : val);
    props.handleHassChange!('input_number', 'set_value', {
      entity_id: entity!.entity_id,
      value: val
    });
  }

  function handleBlur() {
    if (attributes && number)
      if (number < attributes.max) {
        setNumber(Number(attributes.min));
      } else if (number > attributes.max) {
        setNumber(Number(attributes.max));
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
            style={{ fontSize: props.card.icon_size }}
          />
        )}
      </Grid>
      {number && (
        <Grid
          className={classes.textContainer}
          item
          container
          direction="row"
          alignContent="center"
          justify="center">
          {attributes && entity!.attributes.mode === 'slider' ? (
            <Grid item xs>
              <Slider
                onChange={handleSliderChange}
                onChangeCommitted={handleSliderChangeComplete}
                value={number}
                getAriaValueText={getText}
                aria-labelledby="input-slider"
                valueLabelDisplay="auto"
                step={attributes ? attributes.step : 1}
                min={attributes ? attributes.min : 0}
                max={attributes ? attributes.max : 100}
              />
            </Grid>
          ) : (
            <Grid item>
              <Input
                value={number}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: attributes ? attributes.step : 1,
                  min: attributes ? attributes.min : 0,
                  max: attributes ? attributes.max : 100,
                  type: 'number',
                  'aria-labelledby': 'input-slider'
                }}
              />
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
}

NumberEntity.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default NumberEntity;
