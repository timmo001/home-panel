import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MUIInput from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import AutoLinkText from 'react-autolink-text2';
import ReactSelect from 'react-select';
import properCase from '../Common/properCase';
import clone from '../Common/clone';
import defaultConfig from './defaultConfig.json';
import configExplanations from './configExplanations.json';

const styles = theme => ({
  input: {
    display: 'flex',
    minWidth: 200,
    padding: 0,
    margin: '4px 0',
    flex: '1 1 auto',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkboxHelper: {
    transform: 'translateY(-50%)'
  },
  resetIconButton: {
    height: 32,
    width: 32,
    marginRight: 8,
    transform: 'translateY(4px)'
  },
  resetIcon: {
    fontSize: 22,
    transform: 'translateY(-8px)'
  },
  select: {
    marginRight: 8
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 10000,
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing.unit * 2
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      id={props.name}
      type={props.type}
      InputProps={{
        autoCapitalize: 'none',
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      value={props.value}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
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

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

function Menu(props) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const cardItems = clone(defaultConfig.items[0].cards);

class Input extends React.PureComponent {
  render() {
    let {
      classes,
      theme,
      entities,
      name,
      defaultValue,
      defaultItemPath,
      itemPath,
      handleConfigChange,
      value
    } = this.props;
    const type =
      clone(defaultItemPath).findIndex(i => i === 'cards') > -1 &&
      this.props.name === 'type'
        ? 'card_type'
        : this.props.name === 'entity_id'
        ? 'ha_entity'
        : defaultValue === 'true'
        ? 'boolean'
        : defaultValue === 'false'
        ? 'boolean'
        : typeof defaultValue;
    const helpText = clone(defaultItemPath).reduce(
      (o, k) => (o[k] = o[k] || {}),
      clone(configExplanations)
    );
    value = value === 'true' ? true : value === 'false' ? false : value;

    switch (type) {
      default:
        return null;
      case 'string':
      case 'number':
        return (
          <FormControl className={classes.input}>
            <InputLabel htmlFor={name}>{properCase(name)}</InputLabel>
            <MUIInput
              id={name}
              type={type}
              inputProps={{ autoCapitalize: 'none' }}
              value={value}
              onChange={event =>
                handleConfigChange(
                  itemPath,
                  type === 'number'
                    ? Number(event.target.value)
                    : event.target.value
                )
              }
            />
            <IconButton
              className={classes.resetIconButton}
              onClick={() => handleConfigChange(itemPath, defaultValue)}>
              <span
                className={classNames('mdi', 'mdi-restore', classes.resetIcon)}
              />
            </IconButton>
            {helpText && (
              <FormHelperText id={name}>
                <AutoLinkText
                  text={helpText}
                  linkProps={{ target: '_blank', rel: 'nofollow' }}
                />
              </FormHelperText>
            )}
          </FormControl>
        );
      case 'boolean':
        return (
          <FormControl className={classes.input}>
            <FormControlLabel
              control={
                <Checkbox
                  value="checked"
                  checked={value}
                  onChange={event =>
                    handleConfigChange(itemPath, event.target.checked)
                  }
                />
              }
              label={properCase(name)}
            />
            <IconButton
              className={classes.resetIconButton}
              onClick={() => handleConfigChange(itemPath, defaultValue)}>
              <span
                className={classNames('mdi', 'mdi-restore', classes.resetIcon)}
              />
            </IconButton>
            <FormHelperText id={name} className={classes.checkboxHelper}>
              <AutoLinkText text={helpText} />
            </FormHelperText>
          </FormControl>
        );
      case 'card_type':
        return (
          <FormControl className={classes.input}>
            <InputLabel htmlFor={name}>{properCase(name)}</InputLabel>
            <Select
              className={classes.select}
              value={value}
              onChange={event =>
                handleConfigChange(itemPath, event.target.value)
              }
              input={<MUIInput id={name} type="string" value={value} />}>
              {cardItems.map((card, x) => (
                <MenuItem key={x} value={card.type}>
                  {card.type}
                </MenuItem>
              ))}
            </Select>
            {helpText && <FormHelperText>{helpText}</FormHelperText>}
          </FormControl>
        );
      case 'ha_entity':
        const selectStyles = {
          input: base => ({
            ...base,
            color: theme.palette.text.main,
            '& input': {
              font: 'inherit'
            }
          })
        };
        const components = {
          Control,
          Menu,
          NoOptionsMessage,
          Option,
          Placeholder,
          SingleValue,
          ValueContainer
        };
        const suggestions = entities.map(e => {
          return {
            value: e[1].entity_id,
            label: (
              <span>
                <Typography
                  component="span"
                  variant="subtitle1"
                  noWrap
                  style={{ lineHeight: 1.2 }}>
                  {e[1].attributes.friendly_name}
                </Typography>
                <Typography
                  component="span"
                  variant="subtitle2"
                  noWrap
                  style={{ lineHeight: 1.2 }}>
                  {e[1].entity_id}
                </Typography>
              </span>
            )
          };
        });
        return (
          <FormControl className={classes.input}>
            <ReactSelect
              classes={classes}
              styles={selectStyles}
              components={components}
              options={suggestions}
              placeholder="Select an Entity"
              value={
                suggestions.find(s => s.value === value) || {
                  value,
                  label: value
                }
              }
              onChange={item => handleConfigChange(itemPath, item.value)}
            />
            <IconButton
              className={classes.resetIconButton}
              onClick={() => handleConfigChange(itemPath, defaultValue)}>
              <span
                className={classNames('mdi', 'mdi-restore', classes.resetIcon)}
              />
            </IconButton>
            {helpText && <FormHelperText>{helpText}</FormHelperText>}
          </FormControl>
        );
    }
  }
}

Input.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]),
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]),
  defaultItemPath: PropTypes.array.isRequired,
  itemPath: PropTypes.array.isRequired,
  handleConfigChange: PropTypes.func.isRequired,
  entities: PropTypes.array
};

export default withStyles(styles, { withTheme: true })(Input);
