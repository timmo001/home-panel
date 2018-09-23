import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import isObject from '../Common/isObject';
import defaultConfig from './defaultConfig.json';
import Item from './Item';

const drawerWidth = 240;

const styles = theme => ({
  dialog: {
    background: theme.palette.backgrounds.default
  },
  root: {
    flexGrow: 1,
    height: 440,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      zIndex: 2000
    }
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative'
    }
  },
  dialogContent: {
    flex: '1 1 auto',
    padding: 0,
    '&:first-child': {
      paddingTop: 0
    }
  },
  navigation: {
    position: 'fixed',
    width: drawerWidth
  },
  navigationDivider: {
    position: 'absolute',
    width: 1,
    height: 'calc(100% - 68px)',
    marginLeft: drawerWidth + 8
  },
  main: {
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth
    },
    padding: theme.spacing.unit * 2,
    overflowY: 'auto',
    flex: '1 1 auto'
  },
  heading: {
    padding: '8px 0 2px 0'
  }
});

class EditConfig extends React.Component {
  state = {
    mobileOpen: false,
    config: this.props.config,
    topLevel: [
      { id: 0, name: 'Theme' },
      { id: 1, name: 'Header' },
      { id: 2, name: 'Pages' },
      { id: 3, name: 'Items' }
    ],
    selected: { id: 0, name: 'Theme' }
  };

  handleDrawerToggle = () => this.setState(state => ({ mobileOpen: !state.mobileOpen }));

  handleConfigChange = (path, value) => {
    console.log(path, value);
    let config = this.state.config;
    // Set the new value
    const lastItem = path.pop();
    const secondLastItem = path.reduce((o, k) => o[k] = o[k] || {}, config);
    if (value === undefined)
      secondLastItem.splice(secondLastItem.indexOf(lastItem));
    else
      if (isObject(value)) {
        if (value.cards) value.cards = [{ ...defaultConfig.items[0].cards[0] }];
        const newValue = JSON.parse(JSON.stringify(value));
        secondLastItem[lastItem].push(newValue);
      } else secondLastItem[lastItem] = value;
    this.setState({ config });
  };

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
          console.log('An error occurred: ', res.status);
        }
      })
      .catch(err => {
        console.log('An error occurred: ', err);
      });
  };

  handleListItemClick = (event, item) => this.setState({ selected: item, mobileOpen: false });

  handleClose = () => this.setState({ config: this.props.config }, () => window.location.reload(true));

  render() {
    const { classes, theme, open } = this.props;
    const { config, topLevel, selected } = this.state;

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <List component="nav" className={classes.navigation}>
          {topLevel.map((i, x) => {
            return <ListItem
              key={x}
              button
              onClick={event => this.handleListItemClick(event, i)}
              selected={selected.id === i.id}>
              <ListItemText primary={i.name} />
            </ListItem>
          })}
        </List>
      </div>
    );

    return (
      <div>
        {config &&
          <Dialog
            fullScreen
            open={open}
            className={classes.dialog}
            disableBackdropClick
            disableEscapeKeyDown
            aria-labelledby="confirmation-dialog-title">
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerToggle}
                  className={classes.navIconHide}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="title" color="inherit" noWrap>
                  Edit Config
                </Typography>
              </Toolbar>
            </AppBar>
            <Hidden mdUp>
              <Drawer
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}>
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
              <Drawer
                variant="permanent"
                open
                classes={{
                  paper: classes.drawerPaper,
                }}>
                {drawer}
              </Drawer>
              <Divider className={classes.navigationDivider} />
            </Hidden>
            <Hidden mdUp>
              <div className={classes.toolbar} />
            </Hidden>
            <div className={classes.main}>
              {selected.id === 0 ?
                <Item
                  objKey={selected.name}
                  defaultItem={defaultConfig.theme}
                  item={config.theme}
                  itemPath={['theme']}
                  handleConfigChange={this.handleConfigChange} />
                : selected.id === 1 ?
                  <Item
                    objKey={selected.name}
                    defaultItem={defaultConfig.header}
                    item={config.header}
                    itemPath={['header']}
                    handleConfigChange={this.handleConfigChange} />
                  : selected.id === 2 ?
                    <Item
                      objKey={selected.name}
                      defaultItem={defaultConfig.pages}
                      item={config.pages}
                      itemPath={['pages']}
                      handleConfigChange={this.handleConfigChange} />
                    : selected.id === 3 &&
                    <Item
                      objKey={selected.name}
                      defaultItem={defaultConfig.items}
                      item={config.items}
                      itemPath={['items']}
                      handleConfigChange={this.handleConfigChange} />
              }
            </div>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        }
      </div>
    );
  }
}

EditConfig.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
  apiUrl: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(EditConfig);
