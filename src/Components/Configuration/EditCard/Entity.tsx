// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { BaseProps } from './Base';
import EntitySelect from '../../HomeAssistant/EntitySelect';

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: '1 1 auto',
    margin: 4
  }
}));

interface EntityProps extends BaseProps {}

function Entity(props: EntityProps) {
  function handleGetEntityIcon() {
    const entity = props.hassEntities.find(
      (entity: any) => entity[0] === props.card.entity
    );
    if (entity && entity[1].attributes.icon)
      props.handleManualChange!(
        'icon',
        entity[1].attributes.icon.replace('mdi:', '')
      );
  }

  const classes = useStyles();
  const domain = props.card.entity && props.card.entity.split('.')[0].trim();

  let iconAllowed = false;
  if (
    domain === 'air_quality' ||
    domain === 'binary_sensor' ||
    domain === 'device_tracker' ||
    domain === 'geo_location' ||
    domain === 'input_boolean' ||
    domain === 'light' ||
    domain === 'remote' ||
    domain === 'sensor' ||
    domain === 'sun' ||
    domain === 'switch'
  )
    iconAllowed = true;

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      {iconAllowed && (
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-end"
          item
          xs>
          <Grid item xs>
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              label="Icon"
              placeholder="thermometer"
              value={props.card.icon}
              onChange={props.handleChange!('icon')}
            />
          </Grid>
          {props.card.type === 'entity' && props.card.entity && (
            <Grid item>
              <Button onClick={handleGetEntityIcon}>Get from HA</Button>
            </Grid>
          )}
        </Grid>
      )}
      <Grid item xs>
        {props.hassEntities ? (
          <EntitySelect
            {...props}
            entity={props.card.entity!}
            handleChange={props.handleChange!('entity')}
          />
        ) : (
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            label="Entity"
            placeholder="sensor.myamazingsensor"
            value={props.card.entity}
            onChange={props.handleChange!('entity')}
          />
        )}
      </Grid>
    </Grid>
  );
}

Entity.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any,
  handleChange: PropTypes.func
};

export default Entity;
