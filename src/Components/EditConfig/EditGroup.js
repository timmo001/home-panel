import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ConfirmDialog from '../Common/ConfirmDialog';
import defaultConfig from './defaultConfig.json';
import Item from './Item';
import clone from '../Common/clone';

const styles = () => ({
  fill: {
    flex: '1 1 auto'
  }
});

class EditGroup extends React.PureComponent {
  state = {
    open: true,
    group: this.props.group
  };

  handleClose = cb => this.setState({ open: false }, cb);

  handleCancel = () =>
    this.handleClose(() => {
      this.props.add
        ? this.props.handleGroupAddDone()
        : this.props.handleGroupEditDone();
    });

  handleSave = () =>
    this.handleClose(() => {
      const path = ['items', this.props.id];
      let group = clone(this.state.group);
      if (this.props.add) group.cards = [];
      this.props.add
        ? this.props.handleGroupAddDone(path, group)
        : this.props.handleGroupEditDone(path, group);
    });

  handleDeleteConfirm = () => this.setState({ confirm: true });

  handleDeleteConfirmClose = () => this.setState({ confirm: false });

  handleDelete = () =>
    this.handleClose(() => {
      this.setState({ confirm: false }, () => {
        const path = ['items', this.props.id];
        this.props.add
          ? this.props.handleGroupAddDone(path)
          : this.props.handleGroupEditDone(path);
      });
    });

  handleConfigChange = (path, value) => {
    let group = clone(this.state.group);
    group[path.pop()] = value;
    this.setState({ group });
  };

  render() {
    const { classes, fullScreen, add, id } = this.props;
    const { open, group, confirm } = this.state;
    let defaultGroup = defaultConfig.items[0];
    delete defaultGroup.cards;

    return (
      <Dialog
        className={classes.dialog}
        open={open}
        fullScreen={fullScreen}
        maxWidth="xl"
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {add ? 'Add' : 'Edit'} Group
        </DialogTitle>
        <DialogContent>
          <Item
            invisible
            objKey={id}
            defaultItem={defaultGroup}
            item={group}
            defaultItemPath={['items']}
            itemPath={['items']}
            handleConfigChange={this.handleConfigChange}
          />
        </DialogContent>
        <DialogActions>
          {!add && (
            <Button onClick={this.handleDeleteConfirm} color="primary">
              Delete
            </Button>
          )}
          <div className={classes.fill} />
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
            {add ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
        {confirm && (
          <ConfirmDialog
            text="Do you want to delete this group?"
            handleClose={this.handleDeleteConfirmClose}
            handleConfirm={this.handleDelete}
          />
        )}
      </Dialog>
    );
  }
}

EditGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  group: PropTypes.object.isRequired,
  pageId: PropTypes.number,
  add: PropTypes.bool,
  handleGroupAddDone: PropTypes.func,
  handleGroupEditDone: PropTypes.func
};

export default compose(
  withMobileDialog(),
  withStyles(styles)
)(EditGroup);
