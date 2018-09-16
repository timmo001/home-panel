import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MUIInput from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
});

class Input extends React.Component {

  render() {
    const { name, value, handleChange } = this.props;

    return (
      <FormControl>
        <InputLabel htmlFor={name}>{name}</InputLabel>
        <MUIInput
          id={name}
          type={typeof value}
          inputProps={{ autoCapitalize: "none" }}
          value={value}
        // onChange={handleChange(name)}
        />
      </FormControl>
    );
  }
}

Input.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  // value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Input);
