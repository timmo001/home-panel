import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import defaultConfig from './defaultConfig.json';
import ConfirmDialog from '../Common/ConfirmDialog';
import Item from './Item';
import clone from '../Common/clone';

const styles = theme => ({
  navigation: {
    opacity: '0.94',
    background: theme.palette.backgrounds.navigation
  },
  fill: {
    flex: '1 1 auto'
  }
});

class EditPage extends React.PureComponent {
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

  handleDeleteConfirm = () => this.setState({ confirm: true });

  handleDeleteConfirmClose = () => this.setState({ confirm: false });

  handleDelete = () => this.handleClose(() => {
    this.setState({ confirm: false }, () => {
      const path = ['pages', this.props.id];
      this.props.add ? this.props.handleCardAddDone(path)
        : this.props.handleCardEditDone(path);
    });
  });

  handleConfigChange = (path, value) => {
    let page = clone(this.state.page);
    page[path.pop()] = value;
    this.setState({ page });
  };

  render() {
    const { classes, add, id } = this.props;
    const { open, page, confirm } = this.state;

    return (
      <Dialog
        fullWidth
        open={open}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{add ? 'Add' : 'Edit'} Page</DialogTitle>
        <BottomNavigation
          className={classes.navigation}
          showLabels
          value={0}>
          <BottomNavigationAction
            label={page.name}
            icon={page.icon && <span className={classnames('mdi', `mdi-${page.icon}`, classes.icon)} />} />
        </BottomNavigation>
        <DialogContent>
          {Object.keys(defaultConfig.pages[0]).map((i, x) =>
            <Item
              key={x}
              objKey={i}
              defaultItem={defaultConfig.pages[0][i]}
              item={page[i] !== undefined ? page[i] : defaultConfig.pages[0][i]}
              defaultItemPath={['pages', 0, i]}
              itemPath={['pages', id, i]}
              handleConfigChange={this.handleConfigChange} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDeleteConfirm} color="primary">
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
        {confirm &&
          <ConfirmDialog
            text="Do you want to delete this card?"
            handleClose={this.handleDeleteConfirmClose}
            handleConfirm={this.handleDelete} />
        }
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
