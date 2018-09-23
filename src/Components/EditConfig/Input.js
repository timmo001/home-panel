import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MUIInput from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import properCase from '../Common/properCase';

const styles = theme => ({
  input: {}
});

class Input extends React.Component {

  render() {
    const { classes, name, defaultValue, value, itemPath, handleConfigChange } = this.props;
    const type = defaultValue === 'true' ? 'boolean'
      : defaultValue === 'false' ? 'boolean'
        : typeof defaultValue;

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
        </FormControl>
      );
      case 'boolean': return (
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={event => handleConfigChange(itemPath, event.target.checked)} />
          }
          label={properCase(name)} />
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
