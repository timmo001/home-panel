import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ConfirmDialog from '../Common/ConfirmDialog';
import dc from './defaultConfig.json';
import Item from './Item';
import clone from '../Common/clone';
import properCase from '../Common/properCase';

const defaultConfig = clone(dc);

const styles = () => ({
  fill: {
    flex: '1 1 auto'
  }
});

class EditItem extends React.PureComponent {
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
      const path = clone(this.props.path);
      let config = clone(this.state.config);
      this.props.add
        ? this.props.handleItemAddDone(path, config)
        : this.props.handleItemEditDone(path, config);
    });

  handleDeleteConfirm = () => this.setState({ confirm: true });

  handleDeleteConfirmClose = () => this.setState({ confirm: false });

  handleDelete = () =>
    this.handleClose(() => {
      this.setState({ confirm: false }, () => {
        const path = ['items', this.props.id];
        this.props.add
          ? this.props.handleItemAddDone(path)
          : this.props.handleItemEditDone(path);
      });
    });

  handleConfigChange = (path, value) => {
    console.log('');
    console.log('handleConfigChange');
    console.log('path:', path);
    console.log('value', value);

    let config = clone(this.state.config);

    console.log('config:', clone(config));

    const lastItem = path.pop();
    console.log('lastItem:', clone(lastItem));
    let secondLastItem = path.reduce((o, k) => (o[k] = o[k] || {}), config);
    console.log('secondLastItem:', clone(secondLastItem));
    secondLastItem[lastItem] = value;

    console.log('secondLastItem after:', clone(secondLastItem));

    console.log('config after:', clone(config));

    this.setState({ config });
  };

  render() {
    const { classes, path } = this.props;
    const { open, config, confirm } = this.state;
    const item = clone(path).reduce(
      (o, k) => (o[k] = o[k] || {}),
      clone(config)
    );
    let defaultItem = clone(path).reduce(
      (o, k) => (o[k] = o[k] || {}),
      defaultConfig
    );

    console.log('');
    console.log('EditItem');
    console.log('path:', path);
    console.log('item', item);
    console.log('defaultItem', defaultItem);

    return (
      <Dialog fullWidth open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Edit {properCase(path[path.length - 1])}
        </DialogTitle>
        <DialogContent>
          {Object.keys(defaultItem).map((i, x) => (
            <Item
              key={x}
              objKey={i}
              defaultItem={defaultItem[i]}
              item={item[i] !== undefined ? item[i] : defaultItem[i]}
              defaultItemPath={path}
              itemPath={path}
              handleConfigChange={this.handleConfigChange}
            />
          ))}
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
        {confirm && (
          <ConfirmDialog
            text="Do you want to delete this item?"
            handleClose={this.handleDeleteConfirmClose}
            handleConfirm={this.handleDelete}
          />
        )}
      </Dialog>
    );
  }
}

EditItem.propTypes = {
  classes: PropTypes.object.isRequired,
  path: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  handleItemEditDone: PropTypes.func
};

export default withStyles(styles)(EditItem);
