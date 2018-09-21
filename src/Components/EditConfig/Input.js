import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MUIInput from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
});

class Input extends React.Component {

  render() {
    const { name, value, defaultValue, handleChange } = this.props;
    // const type = defaultValue === 'true' ? 'boolean'
    //   : defaultValue === 'false' ? 'boolean'
    //     : typeof defaultValue;

    // switch (type) {
    //   default: return null;
    // case 'string': 
    return (
      <FormControl>
        <InputLabel htmlFor={name}>{name}</InputLabel>
        <MUIInput
          id={name}
          type="string"
          inputProps={{ autoCapitalize: "none" }}
          value={value}
          onChange={handleChange(name)} />
      </FormControl>
    );
    //   case 'number': return (
    //     <FormControl>
    //       <InputLabel htmlFor={name}>{name}</InputLabel>
    //       <MUIInput
    //         id={name}
    //         type="number"
    //         inputProps={{ autoCapitalize: "none" }}
    //         value={value}
    //         onChange={handleChange(name)} />
    //     </FormControl>
    //   );
    //   case 'boolean': return (
    //     <FormControlLabel
    //       control={
    //         <Checkbox
    //           checked={value}
    //           onChange={handleChange(name)}
    //           value={name} />
    //       }
    //       label={name} />
    //   );
    // }
  }
}

Input.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  // defaultValue: PropTypes.oneOfType(
  //   PropTypes.string,
  //   PropTypes.number,
  //   PropTypes.bool
  // ),
  // value: PropTypes.oneOfType(
  //   PropTypes.string,
  //   PropTypes.number,
  //   PropTypes.bool
  // ),
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Input);
