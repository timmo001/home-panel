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
import Item from './Item';

const styles = theme => ({
  navigation: {
    opacity: '0.94',
    background: theme.palette.backgrounds.navigation
  }
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

  handleConfigChange = (path, value) => {
    const { page } = this.props;
    page[path.pop()] = value;
    this.setState({ page });
  };

  render() {
    const { classes, add, id } = this.props;
    const { open, page } = this.state;

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
            icon={page.icon && <i className={classnames('mdi', `mdi-${page.icon}`, classes.icon)} />} />
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
