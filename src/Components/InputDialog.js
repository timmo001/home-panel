// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
  root: {
    transform: 'initial',
  },
});

class InputDialog extends React.Component {
  radioGroup = null;

  constructor(props) {
    super(props);

    this.state.value = this.props.value;
  }

  state = {};

  // TODO
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleEntering = () => {
    this.radioGroup.focus();
  };

  handleCancel = () => {
    this.props.handleChange(this.props.value);
  };

  handleOk = () => {
    this.props.handleChange(this.state.value);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, entities, open } = this.props;

    return (
      <Dialog
        className={classes.root}
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={this.handleEntering}
        aria-labelledby="confirmation-dialog-title">
        <DialogTitle id="confirmation-dialog-title">Select Source</DialogTitle>
        <DialogContent>
          <RadioGroup
            ref={node => {
              this.radioGroup = node;
            }}
            aria-label="Ringtone"
            name="ringtone"
            value={this.state.value}
            onChange={this.handleChange}>
            {entities.filter(i => i[1].entity_id.startsWith('media_player')).map(entity => (
              <FormControlLabel
                value={entity[1].entity_id}
                key={entity[1].entity_id}
                control={<Radio />}
                label={entity[1].attributes.friendly_name} />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

InputDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  entities: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(InputDialog);