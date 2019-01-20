import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = () => ({
});

class EditPage extends React.Component {
  state = {
    open: true,
    page: this.props.page
  };

  handleClose = cb => this.setState({ open: false }, cb);

  handleCancel = () => this.handleClose(() => {
    this.props.add ? this.props.handlePageAddDone()
      : this.props.handlePageEditDone();
  });

  handleSave = () => this.handleClose(() => {
    this.props.add ? this.props.handlePageAddDone(this.props.id, this.state.page)
      : this.props.handlePageEditDone(this.props.id, this.state.page);
  });

  handleChange = name => event => {
    const { page } = this.props;
    page[name] = event.target.value
    this.setState({ page });
  };

  render() {
    const { add } = this.props;
    const { open, page } = this.state;

    return (
      <Dialog
        open={open}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{add ? 'Add' : 'Edit'} Page</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={page.name}
            onChange={this.handleChange('name')}
            fullWidth />
          <TextField
            margin="dense"
            id="icon"
            label="Icon"
            type="text"
            value={page.icon}
            onChange={this.handleChange('icon')}
            fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
            {add ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditPage.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  page: PropTypes.object.isRequired,
  add: PropTypes.bool,
  handlePageAddDone: PropTypes.func,
  handlePageEditDone: PropTypes.func
};

export default withStyles(styles)(EditPage);
