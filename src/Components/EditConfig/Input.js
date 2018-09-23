import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MUIInput from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import properCase from '../Common/properCase';
import configExplanations from './configExplanations.json';

const styles = theme => ({
  input: {
    flex: '1 1 auto',
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  checkboxHelper: {
    transform: 'translateY(-50%)'
  }
});

class Input extends React.Component {
  state = {
    type: '',
    helpText: ''
  };

  componentDidMount = () => {
    const type = this.props.defaultValue === 'true' ? 'boolean'
      : this.props.defaultValue === 'false' ? 'boolean'
        : typeof this.props.defaultValue;

    const lastItem = this.props.itemPath.pop();
    const helpText = this.props.itemPath.reduce((o, k) => o[k] = o[k] || {}, configExplanations)[lastItem];
    this.setState({ type, helpText });
  };

  render() {
    const { classes, name, value, itemPath, handleConfigChange } = this.props;
    const { type, helpText } = this.state;

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
            <FormHelperText id={name}>{helpText}</FormHelperText>
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
          <FormHelperText id={name}>{helpText}</FormHelperText>
        </FormControl>
      );
      case 'boolean': return (
        <FormControl className={classes.input}>
          <FormControlLabel
            control={
              <Checkbox
                checked={value}
                onChange={event => handleConfigChange(itemPath, event.target.checked)} />
            }
            label={properCase(name)} />
          <FormHelperText id={name} className={classes.checkboxHelper}>{helpText}</FormHelperText>
        </FormControl>
      );
    }
  }
}

Input.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  itemPath: PropTypes.array.isRequired,
  handleConfigChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Input);
