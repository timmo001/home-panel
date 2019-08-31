// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HassEntity } from 'home-assistant-js-websocket';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';
import { CirclePicker, ColorResult } from 'react-color';

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
    alignContent: 'center',
    justifyContent: 'center'
  },
  icon: {
    height: 64,
    width: 64,
    textAlign: 'center',
    verticalAlign: 'center'
  },
  select: {
    minWidth: '100%',
    width: '100%'
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
  const [attributes, setAttributes] = React.useState();
  const [color, setColor] = React.useState('');

  const classes = useStyles();
  const theme = useTheme();
  let entity: HassEntity | undefined,
    state: string | undefined,
    attrClasses: string[] = [];
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
    attrClasses = featureClassNames(entity!, FEATURE_CLASS_NAMES);
  }

  useEffect(() => {
    if (entity) {
      setAttributes(entity.attributes);
      setColor(
        state === 'unavailable'
          ? grey[600]
          : state === 'on'
          ? entity.attributes.rgb_color
            ? `rgb(${entity.attributes.rgb_color.join(',')})`
            : theme.palette.primary.main
          : theme.palette.text.primary
      );
    }
  }, [entity, state, theme.palette.primary.main, theme.palette.text.primary]);

  const getText = (value: number) => `${value}`;

  const handleSliderChange = (name: string) => (
    _event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    setAttributes({ ...attributes, [name]: value });
  };

  const handleSliderChangeComplete = (name: string) => (
    _event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    props.handleHassChange!('light', true, {
      entity_id: entity!.entity_id,
      [name]: value
    });
  };

  function handleColorChange(color: ColorResult) {
    setAttributes({
      ...attributes,
      rgb_color: [color.rgb.r, color.rgb.g, color.rgb.b]
    });
    props.handleHassChange!('light', true, {
      entity_id: entity!.entity_id,
      rgb_color: [color.rgb.r, color.rgb.g, color.rgb.b]
    });
  }

  const handleSelectChange = (name: string) => (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
    _child: React.ReactNode
  ) => {
    setAttributes({ ...attributes, [name]: event.target.value });
    props.handleHassChange!('light', true, {
      entity_id: entity!.entity_id,
      [name]: event.target.value
    });
  };

  const controls = [];

  if (attrClasses.includes('has-brightness'))
    controls.push(
      <Grid key={0} item xs={10}>
        <Typography id="discrete-slider" gutterBottom>
          Brightness
        </Typography>
        <Slider
          onChange={handleSliderChange('brightness_pct')}
          onChangeCommitted={handleSliderChangeComplete('brightness_pct')}
          value={
            attributes
              ? attributes.brightness_pct
                ? attributes.brightness_pct
                : attributes.brightness
                ? (attributes.brightness / 255) * 100
                : 0
              : 0
          }
          getAriaValueText={getText}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          min={0}
          max={100}
        />
      </Grid>
    );
  if (attrClasses.includes('has-color_temp') && state === 'on')
    controls.push(
      <Grid key={1} item xs={10}>
        <Typography id="discrete-slider" gutterBottom>
          Color Temperature
        </Typography>
        <Slider
          onChange={handleSliderChange('color_temp')}
          onChangeCommitted={handleSliderChangeComplete('color_temp')}
          value={attributes ? attributes.color_temp : 0}
          getAriaValueText={getText}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          min={attributes ? attributes.min_mireds : 0}
          max={attributes ? attributes.max_mireds : 0}
        />
      </Grid>
    );
  if (attrClasses.includes('has-white_value') && state === 'on')
    controls.push(
      <Grid key={2} item xs={10}>
        <Typography id="discrete-slider" gutterBottom>
          White Value
        </Typography>
        <Slider
          onChange={handleSliderChange('white_value')}
          onChangeCommitted={handleSliderChangeComplete('white_value')}
          value={attributes ? attributes.white_value : 0}
          getAriaValueText={getText}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          min={0}
          max={255}
        />
      </Grid>
    );
  if (attrClasses.includes('has-color') && state === 'on')
    controls.push(
      <Grid key={3} item xs={10}>
        <CirclePicker circleSpacing={6} onChangeComplete={handleColorChange} />
      </Grid>
    );
  if (attrClasses.includes('has-effect_list') && state === 'on')
    controls.push(
      <Grid key={4} item xs={10}>
        <FormControl>
          <InputLabel htmlFor="effect">Effect</InputLabel>
          <Select
            className={classes.select}
            value={attributes && attributes.effect ? attributes.effect : 'none'}
            onChange={handleSelectChange('effect')}
            inputProps={{
              name: 'effect',
              id: 'effect'
            }}>
            <MenuItem value="none">None</MenuItem>
            {attributes &&
              attributes.effect_list &&
              attributes.effect_list.map((effect: string, key: number) => (
                <MenuItem key={key} value={effect}>
                  {effect}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
    );

  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      alignContent="center"
      justify="center">
      <Grid className={classes.iconContainer} item xs={10}>
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
      {props.card.disabled && (
        <Grid item xs={10}>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant="body1"
            component="h5">
            {state}
          </Typography>
        </Grid>
      )}
      {controls
        .splice(0, props.card.height! > 1 ? props.card.height! : 0)
        .map(control => control)}
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
