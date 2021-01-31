import React, { useEffect, ReactElement, useState, useMemo } from "react";
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Slide from "@material-ui/core/Slide";
import SwipeableDrawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";

import { ConfigurationProps } from "../Configuration/Config";
import { Editing, ProgressState } from "../Types/Types";
import { MainProps } from "../Main";
import HomeAssistantLogin from "../HomeAssistant/HomeAssistantLogin";
import Items, { DrawerItem, MenuItem } from "./Items";

const drawerWidth = 240,
  drawerWidthIcons = 54;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  permanentIconsRoot: {
    zIndex: 2000,
  },
  avatar: {
    background: theme.palette.primary.main,
    color: theme.palette.text.primary,
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerInner: {
    display: "flex",
    flexDirection: "column",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerPaperIcons: {
    width: drawerWidthIcons,
    overflowX: "hidden",
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    background: theme.palette.background.paper,
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  drawerHeaderDense: {
    minHeight: 48,
    maxHeight: 48,
  },
  drawerHeaderText: {
    marginLeft: theme.spacing(1),
  },
  persistentToolbar: {
    marginLeft: drawerWidth,
  },
  persistentToolbarIcons: {
    marginLeft: drawerWidthIcons,
  },
  heading: {
    flex: 1,
  },
  icon: {
    fontSize: 22,
  },
  link: {
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  linkToolbar: {
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.text.primary,
    },
    maxWidth: 50,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
}));

interface ResponsiveDrawerProps extends MainProps {
  config: ConfigurationProps;
  editing: Editing;
  hassConnection: ProgressState;
  mouseMoved: boolean;
  userInitials: string;
  handleHassLogin: (url: string) => void;
  handleLogout: () => void;
  handleSetEditing: (editing: Editing) => void;
  handleSpaceTaken: (space: number) => void;
}

function ResponsiveDrawer(props: ResponsiveDrawerProps): ReactElement {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(
    props.config.general.drawer_type &&
      props.config.general.drawer_type.includes("persistent")
      ? true
      : false
  );

  useEffect(() => {
    props.handleSpaceTaken(
      props.config.general.drawer_type === "persistent" && drawerOpen
        ? drawerWidth
        : props.config.general.drawer_type === "persistent_icons_only" &&
          drawerOpen
        ? drawerWidthIcons
        : props.config.general.drawer_type === "permanent_icons_only"
        ? drawerWidthIcons
        : 0
    );
  }, [props, drawerOpen]);

  function handleDrawerToggle(): void {
    setDrawerOpen(!drawerOpen);
  }

  function handleDrawerClose(): void {
    setDrawerOpen(false);
  }

  const handleItemClicked = (item: DrawerItem) => () => {
    if (
      !props.config.general.drawer_type ||
      !props.config.general.drawer_type.includes("persistent")
    )
      handleDrawerClose();
    props.handleSetCurrentPage(item.name);
  };

  function handleToggleEditing() {
    props.handleSetEditing(props.editing === 0 ? 1 : 0);
  }

  const hideText = useMemo(
    () =>
      !(
        props.config.general.drawer_type !== "persistent_icons_only" &&
        props.config.general.drawer_type !== "permanent_icons_only"
      ),
    [props.config.general.drawer_type]
  );

  const drawer = (
    <div>
      <div
        className={clsx(
          classes.drawerHeader,
          props.config.general.dense_toolbar && classes.drawerHeaderDense
        )}>
        {props.config.general.drawer_type !== "persistent_icons_only" && (
          <Typography className={classes.drawerHeaderText} variant="h6" noWrap>
            Home Panel
          </Typography>
        )}
        <Avatar className={classes.avatar}>
          {props.userInitials && props.userInitials}
        </Avatar>
      </div>
      <Divider />
      <div className={classes.drawerInner}>
        <List>
          {Items.map((item: DrawerItem, key: number) => (
            <ListItem
              key={key}
              selected={props.currentPage === item.name ? true : false}
              button
              onClick={handleItemClicked(item)}>
              <ListItemIcon>
                <span className={clsx("mdi", item.icon, classes.icon)} />
              </ListItemIcon>
              {!hideText && <ListItemText primary={item.name} />}
            </ListItem>
          ))}
        </List>
        <div className={"fill"} />
        <Divider />
        <List>
          {props.hassConnection === -2 && (
            <HomeAssistantLogin
              iconOnly={
                props.config.general.drawer_type === "persistent_icons_only" ||
                props.config.general.drawer_type === "permanent_icons_only"
              }
              handleHassLogin={props.handleHassLogin}
            />
          )}
          <ListItem button onClick={props.handleLogout}>
            <ListItemIcon>
              <span className={clsx("mdi", "mdi-logout", classes.icon)} />
            </ListItemIcon>
            {!hideText && <ListItemText primary="Log Out" />}
          </ListItem>
        </List>
      </div>
    </div>
  );

  const currentPageItem = useMemo(
    () => Items.find((item: DrawerItem) => item.name === props.currentPage),
    [props.currentPage]
  );

  const showToolbar = useMemo(
    () =>
      !props.config.general.autohide_toolbar ||
      props.currentPage === "Configuration"
        ? true
        : false || drawerOpen || props.mouseMoved,
    [
      props.config.general.autohide_toolbar,
      props.currentPage,
      props.mouseMoved,
      drawerOpen,
    ]
  );

  return (
    <div
      className={clsx(
        classes.root,
        props.config.general.drawer_type === "persistent" && drawerOpen
          ? classes.persistentToolbar
          : props.config.general.drawer_type === "persistent_icons_only" &&
            drawerOpen
          ? classes.persistentToolbarIcons
          : null
      )}>
      <Slide direction="down" in={showToolbar} mountOnEnter unmountOnExit>
        <AppBar
          className={clsx(
            (props.config.general.drawer_type === "persistent_icons_only" &&
              drawerOpen) ||
              props.config.general.drawer_type === "permanent_icons_only"
              ? classes.permanentIconsRoot
              : null
          )}>
          <Toolbar
            className={clsx(
              props.config.general.drawer_type === "persistent" && drawerOpen
                ? classes.persistentToolbar
                : null
            )}
            variant={
              props.config &&
              props.config.general &&
              props.config.general.dense_toolbar
                ? "dense"
                : "regular"
            }>
            {props.config.general.drawer_type !== "permanent_icons_only" && (
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
              currentPageItem.menuItems.map((item: MenuItem, key: number) => {
                return (
                  <IconButton
                    key={key}
                    color="inherit"
                    aria-label={item.name}
                    className={classes.menuButton}
                    onClick={handleToggleEditing}>
                    <span
                      className={clsx(
                        "mdi",
                        props.editing ? "mdi-check" : item.icon,
                        classes.icon
                      )}
                    />
                  </IconButton>
                );
              })}
          </Toolbar>
        </AppBar>
      </Slide>
      <nav className={classes.drawer}>
        <SwipeableDrawer
          variant={
            props.config.general.drawer_type === "persistent" && drawerOpen
              ? "persistent"
              : props.config.general.drawer_type === "persistent_icons_only" &&
                drawerOpen
              ? "persistent"
              : props.config.general.drawer_type === "permanent_icons_only"
              ? "permanent"
              : "temporary"
          }
          open={drawerOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper:
              props.config.general.drawer_type === "persistent" && drawerOpen
                ? classes.drawerPaper
                : props.config.general.drawer_type ===
                    "persistent_icons_only" && drawerOpen
                ? classes.drawerPaperIcons
                : props.config.general.drawer_type === "permanent_icons_only"
                ? classes.drawerPaperIcons
                : classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}>
          {drawer}
        </SwipeableDrawer>
      </nav>
    </div>
  );
}

export default ResponsiveDrawer;
