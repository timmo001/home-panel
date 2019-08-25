// @flow
import React from 'react';
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
import { ThemeProps } from './Config';

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
  const classes = useStyles();

  const lastItem = props.path!.pop();
  let secondLastItem = props.path!.reduce(
    (o, k) => (o[k] = o[k] || {}),
    props.config
  );
  let value = secondLastItem[lastItem];
  if (!value) value = props.item.default;

  switch (props.item.type) {
    default:
      return null;
    case 'array':
      const items = value.map((item: any, key: number) => ({
        name: key,
        title: Object.values(item)[0],
        type: 'object',
        default: props.item.default,
        items: props.item.items
      }));
      return (
        <IconButton
          color="inherit"
          aria-label="Edit"
          onClick={props.handleSetSections!(
            [...props.path!, props.item.name],
            items
          )}>
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
          defaultValue={value}
          onChange={props.handleChange!(
            [...props.path!, props.item.name],
            typeof props.item.default === 'number' ? 'number' : 'string'
          )}
        />
      );
    case 'object':
      return (
        <Section
          {...props}
          path={[...props.path!, props.item.name]}
          section={props.item}
        />
      );
    case 'radio':
      return (
        <FormControl component="fieldset">
          <RadioGroup
            className={classes.radioGroup}
            aria-label={props.item.title}
            name={props.item.name}
            defaultValue={String(value)}
            onChange={props.handleRadioChange!([
              ...props.path!,
              props.item.name
            ])}>
            {props.item.items.map((rItem: any) => (
              <FormControlLabel
                key={rItem.name}
                value={String(rItem.name)}
                label={rItem.title}
                control={<Radio color="primary" />}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    case 'switch':
      return (
        <Switch
          color="primary"
          defaultChecked={value}
          onChange={props.handleSwitchChange!([
            ...props.path!,
            props.item.name
          ])}
        />
      );
    case 'theme':
      return (
        <FormControl>
          <InputLabel htmlFor="theme">Theme</InputLabel>
          <Select
            value={value}
            onChange={props.handleSelectChange!([
              ...props.path!,
              props.item.name
            ])}
            inputProps={{
              name: 'theme',
              id: 'theme'
            }}>
            {props.config.theme.themes ? (
              props.config.theme.themes.map(
                (theme: ThemeProps, key: number) => (
                  <MenuItem key={key} value={key}>
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
  handleChange: PropTypes.func.isRequired,
  handleRadioChange: PropTypes.func.isRequired,
  handleSwitchChange: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired
};

export default Item;
