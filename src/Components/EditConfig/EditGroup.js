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

const styles = theme => ({
  navigation: {
    opacity: '0.94',
    background: theme.palette.backgrounds.navigation
  },
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
    this.props.add ? this.props.handleGroupAddDone(this.props.id, this.state.group)
      : this.props.handleGroupEditDone(this.props.id, this.state.group);
  });

  handleDelete = () => this.handleClose(() => {
    this.props.add ? this.props.handleGroupAddDone(this.props.id)
      : this.props.handleGroupEditDone(this.props.id);
  });

  handleConfigChange = (path, value) => {
    const { group } = this.props;
    group[path.pop()] = value;
    this.setState({ group });
  };

  render() {
    const { classes, add, id } = this.props;
    const { open, group } = this.state;
    const defaultGroup = defaultConfig.items[0];
    defaultGroup.cards = [];

    console.log(id, group, defaultGroup);

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
          <Button onClick={this.handleDelete} color="primary">
            Delete
          </Button>
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
  add: PropTypes.bool,
  handleGroupAddDone: PropTypes.func,
  handleGroupEditDone: PropTypes.func
};

export default withStyles(styles)(EditGroup);
