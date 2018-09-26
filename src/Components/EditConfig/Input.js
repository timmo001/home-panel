import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MUIInput from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AutoLinkText from 'react-autolink-text2';
import properCase from '../Common/properCase';
import defaultConfig from './defaultConfig.json';
import configExplanations from './configExplanations.json';

const styles = theme => ({
  input: {
    flex: '1 1 auto',
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  checkboxHelper: {
    transform: 'translateY(-50%)'
  },
  resetIconButton: {
    display: 'block',
    height: 20,
    width: 20
  },
  resetIcon: {
    height: 16,
    width: 16
  }
});

class Input extends React.Component {
  state = {
    type: '',
    helpText: ''
  };

  componentDidMount = () => {
    const type = this.props.defaultItemPath.findIndex(i => i === 'cards') > -1 && this.props.name === 'type' ? 'card_type'
      : this.props.defaultValue === 'true' ? 'boolean'
        : this.props.defaultValue === 'false' ? 'boolean'
          : typeof this.props.defaultValue;

    const lastItem = this.props.defaultItemPath.pop();
    const helpText = this.props.defaultItemPath.reduce((o, k) => o[k] = o[k] || {}, configExplanations)[lastItem];
    this.setState({ type, helpText });
  };

  render() {
    const { classes, name, defaultValue, itemPath, handleConfigChange } = this.props;
    const { type, helpText } = this.state;

    let value = this.props.value;
    if (value === 'true') value = true;
    if (value === 'false') value = false;

    switch (type) {
      default: return null;
      case 'string':
        return (
          <FormControl className={classes.input}>
            <InputLabel htmlFor={name}>{properCase(name)}</InputLabel>
            <MUIInput
              id={name}
              type="string"
              inputProps={{ autoCapitalize: "none" }}
              value={value}
              onChange={event => handleConfigChange(itemPath, event.target.value)} />
            <IconButton className={classes.resetIconButton} onClick={() => handleConfigChange(itemPath, defaultValue)}>
              <i className={classnames('mdi', 'mdi-restore', classes.resetIcon)} />
            </IconButton>
            <FormHelperText id={name}><AutoLinkText text={helpText} /></FormHelperText>
          </FormControl>
        );
      case 'number': return (
        <FormControl className={classes.input}>
          <InputLabel htmlFor={name}>{properCase(name)}</InputLabel>
          <MUIInput
            id={name}
            type="number"
            inputProps={{ autoCapitalize: "none" }}
            value={value}
            onChange={event => handleConfigChange(itemPath, Number(event.target.value))} />
          <IconButton className={classes.resetIconButton} onClick={() => handleConfigChange(itemPath, defaultValue)}>
            <i className={classnames('mdi', 'mdi-restore', classes.resetIcon)} />
          </IconButton>
          <FormHelperText id={name}><AutoLinkText text={helpText} /></FormHelperText>
        </FormControl>
      );
      case 'boolean': return (
        <FormControl className={classes.input}>
          <FormControlLabel
            control={
              <Checkbox
                value="checked"
                checked={value}
                onChange={event => handleConfigChange(itemPath, event.target.checked)} />
            }
            label={properCase(name)} />
          <IconButton className={classes.resetIconButton} onClick={() => handleConfigChange(itemPath, defaultValue)}>
            <i className={classnames('mdi', 'mdi-restore', classes.resetIcon)} />
          </IconButton>
          <FormHelperText id={name} className={classes.checkboxHelper}><AutoLinkText text={helpText} /></FormHelperText>
        </FormControl>
      );
      case 'card_type': return (
        <FormControl className={classes.input}>
          <InputLabel htmlFor={name}>{properCase(name)}</InputLabel>
          <Select
            value={value}
            onChange={event => handleConfigChange(itemPath, event.target.value)}
            input={<MUIInput id={name} type="string" value={value} />}>
            {defaultConfig.items[0].cards.map((card, x) => {
              return <MenuItem key={x} value={card.type}>{card.type}</MenuItem>
            })}
          </Select>
          <FormHelperText>{helpText}</FormHelperText>
        </FormControl>
      );
    }
  }
}

Input.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  defaultItemPath: PropTypes.array.isRequired,
  itemPath: PropTypes.array.isRequired,
  handleConfigChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Input);
