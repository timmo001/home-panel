// @flow
import React, {
  CSSProperties,
  HTMLAttributes,
  useEffect,
  useState
} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import NoSsr from '@material-ui/core/NoSsr';
import Paper from '@material-ui/core/Paper';
import TextField, { BaseTextFieldProps } from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { HomeAssistantEntityProps } from './HomeAssistant';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 120,
      flexGrow: 1
    },
    textField: {
      width: 'calc(100% - 8px)',
      margin: 4
    },
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto'
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden'
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2)
    },
    singleValue: {
      fontSize: 16
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      bottom: 6,
      fontSize: 16
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      left: 0,
      right: 0
    },
    divider: {
      height: theme.spacing(2)
    }
  })
);

interface EntitySelectProps extends HomeAssistantEntityProps {
  entity: string;
  handleChange: (value: any) => void;
}

interface OptionType {
  label: string;
  value: string;
}

function NoOptionsMessage(props: any) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

NoOptionsMessage.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
} as any;

type InputComponentProps = Pick<BaseTextFieldProps, 'inputRef'> &
  HTMLAttributes<HTMLDivElement>;

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

inputComponent.propTypes = {
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
} as any;

function Control(props: any) {
  return (
    <TextField
      className={props.selectProps.classes.textField}
      fullWidth
      label="Entity"
      placeholder="sensor.myamazingsensor"
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.TextFieldProps}
    />
  );
}

Control.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectProps: PropTypes.object.isRequired
} as any;

function Option(props: any) {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}>
      {props.children}
    </MenuItem>
  );
}

Option.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool
} as any;

function Placeholder(props: any) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

Placeholder.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
} as any;

function SingleValue(props: any) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

SingleValue.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object.isRequired
} as any;

function ValueContainer(props: any) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired
} as any;

function Menu(props: any) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

Menu.propTypes = {
  children: PropTypes.node,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object
} as any;

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

function EntitySelect(props: EntitySelectProps) {
  const classes = useStyles();
  const theme = useTheme();

  function handleChange(option: any) {
    if (option) {
      const opt: any = option;
      props.handleChange(opt.value);
    }
  }

  const selectStyles = {
    input: (base: CSSProperties) => ({
      ...base,
      overflow: 'visible',
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit'
      }
    })
  };

  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState();

  useEffect(
    () =>
      setSuggestions(
        props.hassEntities.map((entity: any) => {
          return {
            label: entity[1].attributes.friendly_name
              ? `${entity[1].attributes.friendly_name} - ${entity[0]}`
              : entity[0],
            value: entity[0]
          };
        })
      ),
    [props.hassEntities]
  );

  useEffect(
    () =>
      setValue(
        suggestions.find((entity: OptionType) => entity.value === props.entity)
      ),
    [props.entity]
  );

  const resultLimit = 20;
  let i = 0;

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          classes={classes}
          styles={selectStyles}
          options={suggestions}
          components={components}
          value={value}
          onChange={handleChange}
          filterOption={({ label }, query) =>
            label.indexOf(query) >= 0 && i++ < resultLimit
          }
          onInputChange={() => {
            i = 0;
          }}
          placeholder="Search for entities"
        />
      </NoSsr>
    </div>
  );
}

EntitySelect.propTypes = {
  entity: PropTypes.string.isRequired,
  hassEntities: PropTypes.any.isRequired,
  handleChange: PropTypes.func
};

export default EntitySelect;
