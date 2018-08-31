import React from 'react';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

class AlarmPanel extends React.Component {
  state = {
    open: true,
  };

  handleClose = () => {
    this.setState({ open: false }, () => {
      this.props.handleClose();
    });
  };

  render() {
    const { open } = this.state;
    const { fullScreen, entity, handleChange } = this.props;
    const { entity_id, attributes } = entity;

    return (
      <Dialog
        open={open}
        fullScreen={fullScreen}
        onClose={() => this.handleClose()}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          {attributes.friendly_name}
          <IconButton
            style={{
              position: 'absolute',
              right: 12,
              top: 12,
            }}
            aria-label="Close"
            onClick={() => this.handleClose()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>

        </DialogContent>
      </Dialog >
    );
  }
}

AlarmPanel.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withMobileDialog()(AlarmPanel);
