import React, { useEffect, ReactElement } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
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
import { ColorResult } from 'react-color';

import { ConfigurationProps } from './Configuration';
import { HomeAssistantEntityProps } from '../HomeAssistant/HomeAssistant';
import { SectionItemsProps } from './Config';
import clone from '../../utils/clone';
import ColorAdornment from '../Utils/ColorAdornment';
// import Section from './Section';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: 80
  },
  backupButton: {
    marginRight: theme.spacing(1)
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

interface ItemProps extends ConfigurationProps, HomeAssistantEntityProps {
  item: SectionItemsProps;
}

let updateTimeout: NodeJS.Timeout;
function Item(props: ItemProps): ReactElement {
  const [value, setValue] = React.useState<string>();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  useEffect(() => {
    setValue(undefined);
  }, [props.section]);

  useEffect(() => {
    if (value === undefined) {
      if (props.path) {
        const lastItem = props.path.pop();
        const secondLastItem = props.path.reduce(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (o: any, k: any) => (o[k] = o[k] || {}),
          props.config
        );
        const val =
          lastItem === undefined || secondLastItem[lastItem] === undefined
            ? props.item.default
            : secondLastItem[lastItem];
        setValue(val);
      }
    }
  }, [props.config, props.item.default, props.path, value]);

  function handleClickShowPassword(): void {
    setShowPassword(!showPassword);
  }

  function handleMouseDownPassword(event: {
    preventDefault: () => void;
  }): void {
    event.preventDefault();
  }

  async function handleUpdate(
    p: (string | number)[],
    v: unknown
  ): Promise<void> {
    const path = clone(p),
      value = clone(v);
    setValue(value);
    if (updateTimeout) clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      props.handleUpdateConfig(path, value);
    }, 500);
  }

  const handleChange = (path: (string | number)[], type: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const val =
      type === 'number' ? Number(event.target.value) : event.target.value;
    handleUpdate(path, val);
  };

  const handleRadioChange = (path: (string | number)[]) => (
    event: React.ChangeEvent<unknown>
  ): void => {
    const val = Number((event.target as HTMLInputElement).value);
    handleUpdate(path, val);
  };

  const handleSwitchChange = (path: (string | number)[]) => (
    _event: React.ChangeEvent<{}>,
    checked: boolean
  ): void => {
    handleUpdate(path, checked);
  };

  const handleSelectChange = (path: (string | number)[]) => (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ): void => {
    handleUpdate(path, event.target.value);
  };

  const handleColorChange = (path: (string | number)[]) => (
    color: ColorResult
  ): void => {
    handleUpdate(path, color.hex);
  };

  const classes = useStyles();

  if (props.item.type !== 'backup_restore' && value === undefined)
    return <div />;
  switch (props.item.type) {
    default:
      return <div />;
    case 'backup_restore':
      return (
        <Grid container direction="row">
          <Button
            className={classes.backupButton}
            color="primary"
            variant="contained"
            onClick={props.handleBackupConfig}>
            Backup
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={props.handleRestoreConfig}>
            Restore
          </Button>
        </Grid>
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
                handleColorChange={handleColorChange(props.path)}
              />
            )
          }}
          value={value}
          onChange={handleChange(props.path, 'color')}
        />
      );
    case 'color_only':
      return (
        <ColorAdornment
          color={value}
          handleColorChange={handleColorChange(props.path)}
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
            props.path,
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
            props.path,
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
    case 'radio':
      return (
        <FormControl component="fieldset">
          <RadioGroup
            className={classes.radioGroup}
            aria-label={props.item.title}
            name={typeof props.item.name === 'string' ? props.item.name : ''}
            value={value}
            onChange={handleRadioChange(props.path)}>
            {props.item.items &&
              props.item.items.map(
                (
                  rItem: string | number | SectionItemsProps,
                  key: number
                ): ReactElement | null => {
                  if (typeof rItem !== 'string' && typeof rItem !== 'number')
                    return null;
                  return (
                    <FormControlLabel
                      key={key}
                      value={key}
                      label={rItem}
                      control={<Radio color="primary" />}
                    />
                  );
                }
              )}
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
            onChange={handleSelectChange(props.path)}>
            {props.item.items &&
              props.item.items.map(
                (
                  sItem: string | number | SectionItemsProps,
                  key: number
                ): ReactElement | null => {
                  if (typeof sItem !== 'string' && typeof sItem !== 'number')
                    return null;
                  return (
                    <MenuItem key={key} value={sItem}>
                      {sItem}
                    </MenuItem>
                  );
                }
              )}
          </Select>
        </FormControl>
      );
    case 'switch':
      return (
        <Switch
          color="primary"
          checked={
            value !== undefined && typeof value === 'boolean'
              ? Boolean(value)
              : Boolean(props.item.default)
          }
          onChange={handleSwitchChange(props.path)}
        />
      );
  }
}

export default Item;
