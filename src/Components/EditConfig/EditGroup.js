import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
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

  handleCancel = () => this.handleClose(() => {
    this.props.add ? this.props.handleGroupAddDone()
      : this.props.handleGroupEditDone();
  });

  handleSave = () => this.handleClose(() => {
    let group = this.state.group;
    if (this.props.add) group.cards = [];
    this.props.add ? this.props.handleGroupAddDone(this.props.id, group)
      : this.props.handleGroupEditDone(this.props.id, group);
  });

  handleDeleteConfirm = () => this.setState({ confirm: true });

  handleDeleteConfirmClose = () => this.setState({ confirm: false });

  handleDelete = () => this.handleClose(() => {
    this.setState({ confirm: false }, () => {
      const path = ['items', this.props.id];
      this.props.add ? this.props.handleCardAddDone(path)
        : this.props.handleCardEditDone(path);
    });
  });

  handleConfigChange = (path, value) => {
    let group = clone(this.state.group);
    group[path.pop()] = value;
    this.setState({ group });
  };

  render() {
    const { classes, add, id } = this.props;
    const { open, group } = this.state;
    let defaultGroup = defaultConfig.items[0];
    delete defaultGroup.cards;

    return (
      <Dialog
        fullWidth
        open={open}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{add ? 'Add' : 'Edit'} Group</DialogTitle>
        <DialogContent>
          {Object.keys(defaultGroup).map((i, x) =>
            <Item
              key={x}
              objKey={i}
              defaultItem={defaultGroup[i]}
              item={group[i] !== undefined ? group[i] : defaultGroup[i]}
              defaultItemPath={['items', 0, i]}
              itemPath={['items', id, i]}
              handleConfigChange={this.handleConfigChange} />
          )}
        </DialogContent>
        <DialogActions>
          {!add &&
            <Button onClick={this.handleDeleteConfirm} color="primary">
              Delete
            </Button>
          }
          <div className={classes.fill} />
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

EditGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  group: PropTypes.object.isRequired,
  pageId: PropTypes.number,
  add: PropTypes.bool,
  handleGroupAddDone: PropTypes.func,
  handleGroupEditDone: PropTypes.func
};

export default withStyles(styles)(EditGroup);
