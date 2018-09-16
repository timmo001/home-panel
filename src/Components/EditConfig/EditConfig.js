import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import defaultConfig from './defaultConfig.json';
import Item from './Item';

class EditConfig extends React.Component {
  state = {
    config: this.props.config,
  };

  handleChange = prop => event => { }//this.setState({ [prop]: event.target.value });

  handleSave = () => {
    request
      .post(`${this.props.apiUrl}/config/set`)
      .send({
        username: this.props.username,
        password: this.props.password,
        config: this.state.config
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
    const { fullScreen, open, handleClose } = this.props;
    const { config } = this.state;

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
          <Typography variant="subheading" style={{ padding: '8px 0 2px 0' }}>Theme</Typography>
          <Divider />
          <Item defaultItem={defaultConfig.theme} item={config.theme} handleChange={this.handleChange} />
          <Typography variant="subheading" style={{ padding: '8px 0 2px 0' }}>Header</Typography>
          <Divider />
          <Item defaultItem={defaultConfig.header} item={config.header} handleChange={this.handleChange} />
          <Typography variant="subheading" style={{ padding: '8px 0 2px 0' }}>Pages</Typography>
          <Divider />
          <Item defaultItem={defaultConfig.pages} item={config.pages} handleChange={this.handleChange} />
          <Typography variant="subheading" style={{ padding: '8px 0 2px 0' }}>Items (Groups)</Typography>
          <Divider />
          <Item defaultItem={defaultConfig.items} item={config.items} handleChange={this.handleChange} />
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
  apiUrl: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withMobileDialog()(EditConfig);