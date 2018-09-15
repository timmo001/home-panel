import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

class EditConfig extends React.Component {
  state = {
    newConfig: '',
  };

  handleChange = prop => event => this.setState({ [prop]: event.target.value });

  handleSave = () => {
    request
      .post(`${this.state.api_url}/config/set`)
      .send({
        username: this.props.username,
        password: this.props.password,
        config: this.state.newConfig
      })
      .retry(2)
      .timeout({
        response: 5000,
        deadline: 30000,
      })
      .then(res => {
        if (res.status === 200) {
          window.location.reload(true);
        } else {
        }
      })
      .catch(err => {
      });
  };

  render() {
    const { fullScreen, open, config, handleClose } = this.props;
    const { newConfig } = this.state;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title">
        <DialogTitle id="confirmation-dialog-title">Edit Config</DialogTitle>
        <DialogContent>
          <JSONInput
            id="config"
            placeholder={config}
            jsObject={newConfig}
            locale={locale}
            height="100%"
            width="100%" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditConfig.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withMobileDialog()(EditConfig);