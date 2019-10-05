// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { BaseProps } from './Base';
import { chartTypes } from '../../Visualisations/Chart';
import EntitySelect from '../../HomeAssistant/Utils/EntitySelect';

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
    domain === 'group' ||
    domain === 'input_boolean' ||
    domain === 'input_number' ||
    domain === 'input_select' ||
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
        {iconAllowed && (
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignItems="flex-end"
            alignContent="flex-end">
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
            {props.card.entity && (
              <Grid item>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleGetEntityIcon}>
                  Get from HA
                </Button>
              </Grid>
            )}
          </Grid>
        )}
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="flex-end"
          alignContent="flex-end">
          {iconAllowed && props.card.icon && (
            <Grid item xs container justify="flex-start" alignContent="center">
              <TextField
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
                type="text"
                label="Icon Size"
                placeholder="initial"
                value={props.card.icon_size}
                onChange={props.handleChange!('icon_size')}
              />
            </Grid>
          )}
          {graphAllowed && props.card.entity && (
            <Grid item xs container justify="flex-start" alignContent="center">
              <TextField
                className={classes.textField}
                InputLabelProps={{ shrink: true }}
                type="text"
                label="State Font Size"
                placeholder="initial"
                value={props.card.state_size}
                onChange={props.handleChange!('state_size')}
              />
            </Grid>
          )}
        </Grid>
        {graphAllowed && props.card.entity && (
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignContent="stretch">
            <Grid item xs>
              <FormControl className={classes.textField}>
                <InputLabel htmlFor="chart">Chart</InputLabel>
                <Select
                  value={props.card.chart ? props.card.chart : ''}
                  onChange={props.handleSelectChange}
                  inputProps={{
                    name: 'chart',
                    id: 'chart'
                  }}>
                  <MenuItem value="">None</MenuItem>
                  {Object.keys(chartTypes).map((chart: string, key: number) => (
                    <MenuItem key={key} value={chart}>
                      {chartTypes[chart]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
        {graphAllowed && props.card.entity && (
          <Grid
            item
            container
            direction="row"
            justify="center"
            alignContent="stretch"
            alignItems="flex-end">
            {props.card.chart && props.card.chart !== 'radialBar' && (
              <Grid item xs>
                <FormControl className={classes.textField}>
                  <InputLabel htmlFor="chart_detail">Chart Detail</InputLabel>
                  <Select
                    value={
                      props.card.chart_detail ? props.card.chart_detail : 3
                    }
                    onChange={props.handleSelectChange}
                    inputProps={{
                      name: 'chart_detail',
                      id: 'chart_detail'
                    }}>
                    <MenuItem value={5}>Low</MenuItem>
                    <MenuItem value={4}>Medium</MenuItem>
                    <MenuItem value={3}>High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            {props.card.chart && props.card.chart !== 'radialBar' && (
              <Grid item xs>
                <TextField
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="Chart Hours From"
                  placeholder="6"
                  inputProps={{
                    autoComplete: 'off',
                    min: 1,
                    max: 48
                  }}
                  value={props.card.chart_from}
                  onChange={props.handleChange!('chart_from')}
                />
              </Grid>
            )}
            {props.card.chart && props.card.chart !== 'radialBar' && (
              <Grid item xs>
                <FormControlLabel
                  className={classes.switch}
                  label="Chart Labels?"
                  labelPlacement="start"
                  control={
                    <Switch
                      color="primary"
                      defaultChecked={props.card.chart_labels}
                    />
                  }
                  onChange={props.handleSwitchChange!('chart_labels')}
                />
              </Grid>
            )}
          </Grid>
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
