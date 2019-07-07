// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { HomeAssistantChangeProps } from 'Components/HomeAssistant/HomeAssistant';
import Entity from './Entity';
import Frame from './Frame';
import Image from './Image';
import Markdown from './Markdown';

const useStyles = makeStyles((theme: Theme) => ({
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
  card: any;
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
  const classes = useStyles();

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid container alignContent="center">
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            label="Title"
            placeholder={'Card Title'}
            defaultValue={props.card.title}
            onChange={props.handleChange!('title')}
          />
        </Grid>
        <Grid container alignContent="center">
          <FormControl className={classes.textField}>
            <InputLabel htmlFor="type">Type</InputLabel>
            <Select
              value={props.card.type}
              onChange={props.handleSelectChange}
              inputProps={{
                name: 'type',
                id: 'type'
              }}>
              <MenuItem value="entity">Entity</MenuItem>
              <MenuItem value="iframe">iFrame</MenuItem>
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="markdown">Markdown</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid item xs container justify="flex-start" alignContent="center">
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            type="number"
            label="Elevation"
            placeholder="1"
            defaultValue={props.card.elevation}
            onChange={props.handleChange!('elevation')}
          />
        </Grid>
        <Grid item xs container justify="flex-start" alignContent="center">
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            label="Background"
            placeholder="default"
            defaultValue={props.card.background}
            onChange={props.handleChange!('background')}
          />
        </Grid>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid item xs container justify="flex-start" alignContent="center">
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            label="Padding"
            placeholder="12px"
            defaultValue={props.card.padding}
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
      <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid item xs container justify="flex-start" alignContent="center">
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            type="number"
            label="Width"
            placeholder="1"
            defaultValue={props.card.width}
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
              defaultValue={props.card.height}
              onChange={props.handleChange!('height')}
            />
          </Grid>
        )}
      </Grid>
      {props.card.type === 'entity' && <Entity {...props} />}
      {props.card.type === 'iframe' && <Frame {...props} />}
      {props.card.type === 'image' && <Image {...props} />}
      {props.card.type === 'markdown' && <Markdown {...props} />}
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
