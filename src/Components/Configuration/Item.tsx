// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { ConfigurationProps } from './Configuration';
import { HomeAssistantEntityProps } from '../HomeAssistant/HomeAssistant';
import Section from './Section';
import { ThemesProps } from './Config';

const useStyles = makeStyles((theme: Theme) => ({
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
  },
  textField: {
    minWidth: 100,
    maxWidth: 130
  }
}));

interface ItemProps extends ConfigurationProps, HomeAssistantEntityProps {}

function Item(props: ItemProps) {
  const [value, setValue] = React.useState();

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
    if (path.pop() === 'theme') {
      const theme = props.config.theme.themes.find(
        (theme: ThemesProps) => theme.key === event.target.value
      );
      if (theme) props.handleSetTheme!(theme);
    }
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
    case 'input':
      return (
        <TextField
          className={classes.textField}
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
    case 'switch':
      if (typeof value !== 'boolean') return <div />;
      return (
        <Switch
          color="primary"
          checked={value}
          onChange={handleSwitchChange(props.path!)}
        />
      );
    case 'theme':
      return (
        <FormControl>
          <InputLabel htmlFor="theme">Theme</InputLabel>
          <Select
            value={value}
            onChange={handleSelectChange(props.path!)}
            inputProps={{
              name: 'theme',
              id: 'theme'
            }}>
            {props.config.theme.themes ? (
              props.config.theme.themes.map(
                (theme: ThemesProps, key: number) => (
                  <MenuItem key={key} value={theme.key}>
                    {theme.name}
                  </MenuItem>
                )
              )
            ) : (
              <MenuItem>No themes found</MenuItem>
            )}
          </Select>
        </FormControl>
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
