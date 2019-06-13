// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { CardBaseProps } from './CardBase';
import EntitySelect from '../HomeAssistant/EntitySelect';
import State from '../HomeAssistant/State';
import Toggle from '../HomeAssistant/Toggle';

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: '1 1 auto',
    margin: 4
  }
}));

interface EntityProps extends CardBaseProps {}

function Entity(props: EntityProps) {
  const classes = useStyles();
  const domain = props.card.entity && props.card.entity.split('.')[0].trim();
  props.card.domain = domain;
  if (!props.card.entity) props.card.entity = '';

  if (props.editing === 2)
    return (
      <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid item xs>
          {props.hassEntities ? (
            <EntitySelect
              {...props}
              entity={props.card.entity}
              handleChange={props.handleChange!('entity')}
            />
          ) : (
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              label="Entity"
              placeholder="sensor.myamazingsensor"
              defaultValue={props.card.entity}
              onChange={props.handleChange!('entity')}
            />
          )}
        </Grid>
      </Grid>
    );

  if (
    domain === 'air_quality' ||
    'binary_sensor' ||
    'device_tracker' ||
    'geo_location' ||
    'sensor' ||
    'sun'
  )
    return (
      <State
        card={props.card}
        hassConfig={props.hassConfig}
        hassEntities={props.hassEntities}
      />
    );

  if (domain === 'input_boolean' || domain === 'light' || domain === 'switch')
    return (
      <Toggle
        card={props.card}
        hassConfig={props.hassConfig}
        hassEntities={props.hassEntities}
      />
    );

  return null;
}

Entity.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any,
  handleChange: PropTypes.func
};

export default Entity;
