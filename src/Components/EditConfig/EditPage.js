import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import withStyles from '@material-ui/core/styles/withStyles';
import ArrowDownwardsIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
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

  handleCancel = () =>
    this.handleClose(() => {
      this.props.add
        ? this.props.handlePageAddDone()
        : this.props.handlePageEditDone();
    });

  handleSave = () =>
    this.handleClose(() => {
      const path = ['pages', this.props.id];
      this.props.add
        ? this.props.handlePageAddDone(path, this.state.page)
        : this.props.handlePageEditDone(path, this.state.page);
    });

  handleDeleteConfirm = () => this.setState({ confirm: true });

  handleDeleteConfirmClose = () => this.setState({ confirm: false });

  handleDelete = () =>
    this.handleClose(() => {
      this.setState({ confirm: false }, () => {
        const path = ['pages', this.props.id];
        this.props.add
          ? this.props.handlePageAddDone(path)
          : this.props.handlePageEditDone(path);
      });
    });

  handleConfigChange = (path, value) => {
    let page = clone(this.state.page);
    page[path.pop()] = value;
    this.setState({ page });
  };

  render() {
    const { classes, fullScreen, add, id, movePosition } = this.props;
    const { open, page, confirm } = this.state;

    return (
      <Dialog
        className={classes.dialog}
        open={open}
        fullScreen={fullScreen}
        maxWidth="xl"
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {add ? 'Add' : 'Edit'} Page
        </DialogTitle>
        <BottomNavigation className={classes.navigation} showLabels value={0}>
          <BottomNavigationAction
            label={page.name}
            icon={
              page.icon && (
                <span
                  className={classnames(
                    'mdi',
                    `mdi-${page.icon}`,
                    classes.icon
                  )}
                />
              )
            }
          />
        </BottomNavigation>
        <DialogContent>
          <Item
            invisible
            objKey={id}
            defaultItem={defaultConfig.pages[0]}
            item={page}
            defaultItemPath={['pages']}
            itemPath={['pages']}
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
          {!add && (
            <IconButton
              onClick={() => movePosition(['pages', id], id - 1)}
              color="primary">
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
          )}
          {!add && (
            <IconButton
              onClick={() => movePosition(['pages', id], id + 1)}
              color="primary">
              <ArrowDownwardsIcon fontSize="small" />
            </IconButton>
          )}
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
            {add ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
        {confirm && (
          <ConfirmDialog
            text="Do you want to delete this page?"
            handleClose={this.handleDeleteConfirmClose}
            handleConfirm={this.handleDelete}
          />
        )}
      </Dialog>
    );
  }
}

EditPage.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  page: PropTypes.object.isRequired,
  add: PropTypes.bool,
  handlePageAddDone: PropTypes.func,
  handlePageEditDone: PropTypes.func,
  movePosition: PropTypes.func
};

export default compose(
  withMobileDialog(),
  withStyles(styles)
)(EditPage);
