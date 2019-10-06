// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { Color } from '../Utils/ColorWheel';
import { ConfigurationProps } from './Configuration';
import { HomeAssistantEntityProps } from '../HomeAssistant/HomeAssistant';
import clone from '../Utils/clone';
import ColorAdornment from './ColorAdornment';
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

let updateTimeout: NodeJS.Timeout;
function Item(props: ItemProps) {
  const [value, setValue] = React.useState();
  const [showPassword, setShowPassword] = React.useState(false);

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

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleMouseDownPassword(event: any) {
    event.preventDefault();
  }

  function handleUpdate(p: any[], v: any) {
    const path = clone(p),
      value = clone(v);
    setValue(value);
    if (updateTimeout) clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      props.handleUpdateConfig!(path, value);
    }, 500);
  }

  const handleChange = (path: any[], type: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val =
      type === 'number' ? Number(event.target.value) : event.target.value;
    handleUpdate(path, val);
  };

  const handleRadioChange = (path: any[]) => (
    event: React.ChangeEvent<unknown>
  ) => {
    const val = Number((event.target as HTMLInputElement).value);
    handleUpdate(path, val);
  };

  const handleSwitchChange = (path: any[]) => (
    _event: React.ChangeEvent<{}>,
    checked: boolean
  ) => {
    handleUpdate(path, checked);
  };

  const handleSelectChange = (path: any[]) => (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    handleUpdate(path, event.target.value);
  };

  const handleColorChange = (path: any[]) => (color: Color) => {
    handleUpdate(path, color.hexString);
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
              <ColorAdornment
                color={value}
                handleColorChange={handleColorChange(props.path!)}
              />
            )
          }}
          value={value}
          onChange={handleChange(props.path!, 'string')}
        />
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
    case 'input_password':
      return (
        <TextField
          className={classes.root}
          type={showPassword ? 'text' : 'password'}
          placeholder={String(props.item.default)}
          value={value}
          onChange={handleChange(
            props.path!,
            typeof props.item.default === 'number' ? 'number' : 'string'
          )}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
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
