// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
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
import { ColorResult } from 'react-color';

import { CardProps, cardTypes, CardType, ConfigurationProps } from '../Config';
import { HomeAssistantChangeProps } from 'Components/HomeAssistant/HomeAssistant';
import ColorAdornment from '../../Utils/ColorAdornment';
import Entity from './Entity';
import Frame from './Frame';
import Image from './Image';
import Markdown from './Markdown';
import News from './News';
import RSS from './RSS';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%'
  },
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: '1 1 auto',
    margin: 4
  },
  title: {
    fontWeight: 400,
    lineHeight: 1.2
  },
  switch: {
    margin: 4
  }
}));

export interface BaseProps
  extends RouteComponentProps,
    HomeAssistantChangeProps {
  card: CardProps;
  config: ConfigurationProps;
  handleManualChange?: (name: string, value: string) => void;
  handleChange?: (
    name: string
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange?: (
    name: string
  ) => (_event: React.ChangeEvent<{}>, checked: boolean) => void;
  handleSelectChange?: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void;
}

function Base(props: BaseProps) {
  function handleGetEntityTitle() {
    const entity = props.hassEntities[props.card.entity!];
    if (entity && entity.attributes.friendly_name)
      props.handleManualChange!('title', entity.attributes.friendly_name);
  }

  const handleColorChange = (name: string) => (color: ColorResult) => {
    props.handleManualChange!(name, color.hex);
  };

  const classes = useStyles();

  if (!props.card) return null;
  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="center" alignContent="stretch">
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-end"
          alignContent="flex-end"
          item
          xs>
          <Grid item xs>
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              label="Title"
              placeholder={'Card Title'}
              value={props.card.title}
              onChange={props.handleChange!('title')}
            />
          </Grid>
          {props.card.type === 'entity' && props.card.entity && (
            <Grid item>
              <Button
                variant="text"
                color="primary"
                onClick={handleGetEntityTitle}>
                Get from HA
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid item container alignContent="center">
          <FormControl className={classes.textField}>
            <InputLabel htmlFor="type">Type</InputLabel>
            <Select
              value={props.card.type}
              onChange={props.handleSelectChange}
              inputProps={{
                name: 'type',
                id: 'type'
              }}>
              {cardTypes.map((type: CardType, key: number) => (
                <MenuItem key={key} value={type.name}>
                  {type.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="row"
        justify="center"
        alignContent="stretch">
        <Grid item xs container justify="flex-start" alignContent="center">
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            type="number"
            label="Elevation"
            placeholder="1"
            value={props.card.elevation}
            onChange={props.handleChange!('elevation')}
          />
        </Grid>
        <Grid item xs container justify="flex-start" alignContent="center">
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            label="Background"
            placeholder="default"
            InputProps={{
              endAdornment: (
                <ColorAdornment
                  color={props.card.background}
                  handleColorChange={handleColorChange('background')}
                />
              )
            }}
            value={props.card.background}
            onChange={props.handleChange!('background')}
          />
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="row"
        justify="center"
        alignContent="stretch">
        <Grid item xs container justify="flex-start" alignContent="center">
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            label="Padding"
            placeholder="12px"
            value={props.card.padding}
            onChange={props.handleChange!('padding')}
          />
        </Grid>
        <Grid item xs container justify="flex-start" alignContent="center">
          <FormControlLabel
            className={classes.switch}
            label="Square?"
            labelPlacement="start"
            control={
              <Switch color="primary" defaultChecked={props.card.square} />
            }
            onChange={props.handleSwitchChange!('square')}
          />
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="row"
        justify="center"
        alignContent="stretch">
        <Grid item xs container justify="flex-start" alignContent="center">
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            type="number"
            label="Width"
            placeholder="1"
            value={props.card.width}
            onChange={props.handleChange!('width')}
          />
        </Grid>
        {props.card.type === 'entity' && (
          <Grid item xs container justify="flex-start" alignContent="center">
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              type="number"
              label="Height"
              placeholder="1"
              value={props.card.height}
              onChange={props.handleChange!('height')}
            />
          </Grid>
        )}
      </Grid>
      <Grid
        item
        container
        direction="row"
        justify="center"
        alignContent="stretch">
        {props.card.title && (
          <Grid item xs container justify="flex-start" alignContent="center">
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              type="text"
              label="Title Font Size"
              placeholder="initial"
              value={props.card.title_size}
              onChange={props.handleChange!('title_size')}
            />
          </Grid>
        )}
      </Grid>
      {props.card.type === 'entity' && <Entity {...props} />}
      {props.card.type === 'iframe' && <Frame {...props} />}
      {props.card.type === 'image' && <Image {...props} />}
      {props.card.type === 'markdown' && <Markdown {...props} />}
      {props.card.type === 'news' && <News {...props} />}
      {props.card.type === 'rss' && <RSS {...props} />}
    </div>
  );
}

Base.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any,
  handleChange: PropTypes.func,
  handleSelectChange: PropTypes.func,
  handleSwitchChange: PropTypes.func
};

export default Base;
