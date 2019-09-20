// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import { BaseProps } from './Base';
import { chartTypes } from '../../Visualisations/Chart';
import EntitySelect from '../../HomeAssistant/EntitySelect';

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: '1 1 auto',
    margin: 4
  },
  switch: {
    margin: 4
  }
}));

interface EntityProps extends BaseProps {}

function Entity(props: EntityProps) {
  function handleGetEntityIcon() {
    const entity = props.hassEntities[props.card.entity!];
    if (entity && entity.attributes.icon)
      props.handleManualChange!(
        'icon',
        entity.attributes.icon.replace('mdi:', '')
      );
  }

  const classes = useStyles();
  const domain = props.card.entity && props.card.entity.split('.')[0].trim();

  let iconAllowed = false,
    graphAllowed = false;
  if (
    domain === 'air_quality' ||
    domain === 'binary_sensor' ||
    domain === 'device_tracker' ||
    domain === 'geo_location' ||
    domain === 'input_boolean' ||
    domain === 'light' ||
    domain === 'lock' ||
    domain === 'remote' ||
    domain === 'scene' ||
    domain === 'script' ||
    domain === 'sensor' ||
    domain === 'sun' ||
    domain === 'switch'
  )
    iconAllowed = true;

  if (
    domain === 'air_quality' ||
    domain === 'binary_sensor' ||
    domain === 'device_tracker' ||
    domain === 'geo_location' ||
    domain === 'sensor' ||
    domain === 'sun'
  )
    graphAllowed = true;

  return (
    <Grid container direction="column" justify="center" alignContent="stretch">
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-end"
        alignContent="flex-end"
        item
        xs>
        {graphAllowed && props.card.entity && (
          <Grid item container alignContent="center">
            <FormControl className={classes.textField}>
              <InputLabel htmlFor="chart">Chart</InputLabel>
              <Select
                value={props.card.chart}
                onChange={props.handleSelectChange}
                inputProps={{
                  name: 'chart',
                  id: 'chart'
                }}>
                {Object.keys(chartTypes).map((chart: string, key: number) => (
                  <MenuItem key={key} value={chart}>
                    {chartTypes[chart]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {iconAllowed && (
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
        )}
        {iconAllowed && props.card.entity && (
          <Grid item>
            <Button onClick={handleGetEntityIcon}>Get from HA</Button>
          </Grid>
        )}
      </Grid>
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
