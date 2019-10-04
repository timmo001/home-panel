// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { SketchPicker, ColorResult } from 'react-color';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import PaletteIcon from '@material-ui/icons/Palette';

import { ConfigurationProps } from './Configuration';
import { HomeAssistantEntityProps } from '../HomeAssistant/HomeAssistant';
import Section from './Section';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: 130,
    maxWidth: 130
  },
  icon: {
    marginRight: theme.spacing(2),
    fontSize: 24
  },
  iconButton: {
    fontSize: 22,
    height: 24
  },
  item: {
    padding: theme.spacing(1.5, 1),
    borderBottom: '1px solid #EEE',
    '&:first-child': {
      paddingTop: 0
    },
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row'
  }
}));

interface ItemProps extends ConfigurationProps, HomeAssistantEntityProps {}

let popperNode: HTMLButtonElement | null | undefined;
function Item(props: ItemProps) {
  const [value, setValue] = React.useState();
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  useEffect(() => {
    setValue(undefined);
  }, [props.section]);

  useEffect(() => {
    if (value === undefined) {
      const lastItem = props.path!.pop();
      let secondLastItem = props.path!.reduce(
        (o, k) => (o[k] = o[k] || {}),
        props.config
      );
      const val =
        secondLastItem[lastItem] === undefined
          ? props.item.default
          : secondLastItem[lastItem];
      setValue(val);
    }
  }, [props.config, props.item.default, props.path, value]);

  const handleChange = (path: any[], type: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val =
      type === 'number' ? Number(event.target.value) : event.target.value;
    setValue(val);
    props.handleUpdateConfig!(path, val);
  };

  const handleRadioChange = (path: any[]) => (
    event: React.ChangeEvent<unknown>
  ) => {
    const val = Number((event.target as HTMLInputElement).value);
    setValue(val);
    props.handleUpdateConfig!(path, val);
  };

  const handleSwitchChange = (path: any[]) => (
    _event: React.ChangeEvent<{}>,
    checked: boolean
  ) => {
    setValue(checked);
    props.handleUpdateConfig!(path, checked);
  };

  const handleSelectChange = (path: any[]) => (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setValue(event.target.value);
    props.handleUpdateConfig!(path, event.target.value);
  };

  function handleToggleColorPicker() {
    setShowColorPicker(!showColorPicker);
  }

  const handleColorChange = (path: any[]) => (color: ColorResult) => {
    setValue(color.hex);
    props.handleUpdateConfig!(path, color.hex);
  };

  const classes = useStyles();

  if (value === undefined) return <div />;
  switch (props.item.type) {
    default:
      return <div />;
    case 'array':
      if (!Array.isArray(value)) return <div />;
      const items = value.map((item: any, key: number) => ({
        name: key,
        title: item.name,
        type: 'object',
        default: props.item.default,
        items: props.item.items
      }));
      return (
        <IconButton
          color="inherit"
          aria-label="Edit"
          onClick={props.handleSetSections!(props.path!, items)}>
          <span
            className={classnames('mdi', 'mdi-pencil', classes.iconButton)}
          />
        </IconButton>
      );
    case 'color':
      return (
        <TextField
          className={classes.root}
          placeholder={String(props.item.default)}
          type="text"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Pick Color"
                  onClick={handleToggleColorPicker}
                  ref={node => {
                    popperNode = node;
                  }}>
                  <PaletteIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          value={value}
          onChange={handleChange(props.path!, 'string')}>
          <Popper
            // className={classes.colorPicker}
            id="options"
            anchorEl={popperNode}
            open={showColorPicker}>
            <SketchPicker
              color={value}
              onChangeComplete={handleColorChange(props.path!)}
            />
          </Popper>
        </TextField>
      );
    case 'input':
      return (
        <TextField
          className={classes.root}
          placeholder={String(props.item.default)}
          type={typeof props.item.default === 'number' ? 'number' : 'text'}
          value={value}
          onChange={handleChange(
            props.path!,
            typeof props.item.default === 'number' ? 'number' : 'string'
          )}
        />
      );
    case 'object':
      return <Section {...props} path={props.path!} section={props.item} />;
    case 'radio':
      return (
        <FormControl component="fieldset">
          <RadioGroup
            className={classes.radioGroup}
            aria-label={props.item.title}
            name={props.item.name}
            value={value}
            onChange={handleRadioChange(props.path!)}>
            {props.item.items.map((rItem: any, key: number) => (
              <FormControlLabel
                key={key}
                value={Number(key)}
                label={rItem}
                control={<Radio color="primary" />}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    case 'select':
      return (
        <FormControl>
          <InputLabel htmlFor="theme"></InputLabel>
          <Select
            className={classes.root}
            value={value}
            onChange={handleSelectChange(props.path!)}>
            {props.item.items &&
              props.item.items.map((sItem: string, key: number) => (
                <MenuItem key={key} value={sItem}>
                  {sItem}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      );
    case 'switch':
      if (typeof value !== 'boolean') return <div />;
      return (
        <Switch
          color="primary"
          checked={value}
          onChange={handleSwitchChange(props.path!)}
        />
      );
  }
}

Item.propTypes = {
  config: PropTypes.any,
  item: PropTypes.any.isRequired,
  path: PropTypes.array.isRequired,
  section: PropTypes.any.isRequired,
  handleUpdateConfig: PropTypes.func.isRequired
};

export default Item;
