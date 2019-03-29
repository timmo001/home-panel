import React from 'react';
import PropTypes from 'prop-types';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import clone from '../Common/clone';

const styles = () => ({
  content: {
    margin: 0
  }
});

class RawEditor extends React.PureComponent {
  state = {
    open: true,
    config: clone(this.props.config)
  };

  handleClose = cb => this.setState({ open: false }, cb);

  handleCancel = () =>
    this.handleClose(() => {
      this.props.add
        ? this.props.handleItemAddDone()
        : this.props.handleItemEditDone();
    });

  handleSave = () =>
    this.handleClose(() => {
      let config = clone(this.state.config);
      this.props.add
        ? this.props.handleRawEditDone(config)
        : this.props.handleRawEditDone(config);
    });

  handleConfigChange = config => this.setState({ config: config.jsObject });

  render() {
    const { classes } = this.props;
    const { open, config } = this.state;

    return (
      <Dialog
        className={classes.dialog}
        open={open}
        fullScreen
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Raw Editor</DialogTitle>
        <DialogContent className={classes.content}>
          <JSONInput
            height="100%"
            width="100%"
            style={{ body: { fontSize: 14 } }}
            locale={locale}
            placeholder={config}
            onChange={this.handleConfigChange}
          />
        </DialogContent>
        <DialogActions>
          <div className={classes.fill} />
          <Button onClick={this.handleCancel} color="primary">
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

RawEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  handleRawEditDone: PropTypes.func.isRequired
};

export default withStyles(styles)(RawEditor);
