// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ArrowBack from '@material-ui/icons/ArrowBack';
import MenuIcon from '@material-ui/icons/Menu';

import { ConfigurationProps } from '../Configuration/Config';
import Items, { ItemsProps, MenuItemsProps } from './Items';
import HomeAssistantLogin from '../HomeAssistant/HomeAssistantLogin';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  avatar: {
    background: theme.palette.primary.main,
    color: theme.palette.text.primary
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerInner: {
    display: 'flex',
    flexDirection: 'column'
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5, 1, 1.5)
  },
  heading: {
    flex: 1
  },
  icon: {
    fontSize: 22,
    height: 24
  },
  link: {
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.primary
    }
  },
  linkToolbar: {
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.primary
    },
    maxWidth: 50
  },
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

interface ResponsiveDrawerProps extends RouteComponentProps {
  back: boolean;
  config: ConfigurationProps;
  currentPage: string;
  editing: number;
  hassConnected: boolean;
  mouseMoved: boolean;
  userInitials: string;
  handleHassLogin: (url: string) => void;
  handleLogout: () => void;
  handleBack: () => void;
}

function ResponsiveDrawer(props: ResponsiveDrawerProps) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const drawer = (
    <div>
      <div className={classes.drawerHeader}>
        <Typography variant="h6" noWrap>
          Home Panel
        </Typography>
        <Avatar className={classes.avatar}>
          {props.userInitials && props.userInitials}
        </Avatar>
      </div>
      <Divider />
      <div className={classes.drawerInner}>
        <List>
          {Items.map((item: ItemsProps, key: number) => {
            return (
              <Link
                key={key}
                className={classes.link}
                to={{ state: { [item.link]: true } }}
                onClick={handleDrawerToggle}>
                <ListItem
                  selected={props.currentPage === item.name ? true : false}
                  button>
                  <ListItemIcon>
                    <span
                      className={classnames('mdi', item.icon, classes.icon)}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              </Link>
            );
          })}
        </List>
        <div className={'fill'} />
        <Divider />
        <List>
          {!props.hassConnected && (
            <ListItem>
              <HomeAssistantLogin handleHassLogin={props.handleHassLogin} />
            </ListItem>
          )}
          <ListItem button onClick={props.handleLogout}>
            <ListItemIcon>
              <span className={classnames('mdi', 'mdi-logout', classes.icon)} />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItem>
        </List>
      </div>
    </div>
  );

  const currentPageItem = Items.find(
    (item: ItemsProps) => props.currentPage === item.name
  );

  const showToolbar =
    !props.config.general.autohide_toolbar ||
    props.location.state.configuration ||
    mobileOpen ||
    props.mouseMoved;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Slide direction="down" in={showToolbar} mountOnEnter unmountOnExit>
        <AppBar position="fixed">
          <Toolbar
            variant={
              props.config &&
              props.config.general &&
              props.config.general.dense_toolbar
                ? 'dense'
                : 'regular'
            }>
            {props.back ? (
              <IconButton
                color="inherit"
                aria-label="Back"
                edge="start"
                onClick={props.handleBack}
                className={classes.menuButton}>
                <ArrowBack />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography className={classes.heading} variant="h6" noWrap>
              {props.currentPage}
            </Typography>
            {currentPageItem &&
              currentPageItem.menuItems &&
              currentPageItem.menuItems.map(
                (item: MenuItemsProps, key: number) => {
                  return (
                    <Link
                      className={classes.linkToolbar}
                      to={{
                        state: {
                          ...props.location.state,
                          edit: props.editing ? false : true
                        }
                      }}
                      key={key}>
                      <IconButton
                        color="inherit"
                        aria-label={item.name}
                        className={classes.menuButton}>
                        <span
                          className={classnames(
                            'mdi',
                            props.editing ? 'mdi-check' : item.icon,
                            classes.icon
                          )}
                        />
                      </IconButton>
                    </Link>
                  );
                }
              )}
          </Toolbar>
        </AppBar>
      </Slide>
      <nav className={classes.drawer}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}>
          {drawer}
        </Drawer>
      </nav>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  currentPage: PropTypes.string.isRequired,
  userInitials: PropTypes.string,
  config: PropTypes.any.isRequired,
  editing: PropTypes.number,
  hassConnected: PropTypes.bool,
  back: PropTypes.bool.isRequired,
  mouseMoved: PropTypes.bool.isRequired,
  handleHassLogin: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired
};

export default ResponsiveDrawer;
