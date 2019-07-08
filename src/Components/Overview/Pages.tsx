// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

import { ConfigProps, PageProps } from '../Configuration/Config';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  icon: {
    fontSize: '1.1rem'
  }
}));

interface TabContainerProps {
  children?: React.ReactNode;
}

function TabContainer(props: TabContainerProps) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

interface PagesProps extends RouteComponentProps, ConfigProps {
  currentPage: number;
  mouseMoved: boolean;
  setPage: (page: number) => void;
}

function Pages(props: PagesProps) {
  function handleChange(_event: React.ChangeEvent<{}>, newValue: number) {
    props.setPage(newValue + 1);
  }

  const classes = useStyles();
  return (
    <Slide direction="up" in={props.mouseMoved} mountOnEnter unmountOnExit>
      <BottomNavigation
        className={classes.root}
        value={props.currentPage}
        onChange={handleChange}
        showLabels>
        {props.config &&
          props.config.pages.map((page: PageProps, key: number) => (
            <BottomNavigationAction
              key={key}
              value={key}
              label={page.name}
              selected={props.currentPage === key}
              icon={
                <Typography
                  className={classnames(
                    'mdi',
                    `mdi-${page.icon}`,
                    classes.icon
                  )}
                  color="textPrimary"
                  variant="h2"
                  component="h5"
                />
              }
            />
          ))}
      </BottomNavigation>
    </Slide>
  );
}

Pages.propTypes = {
  config: PropTypes.any,
  editing: PropTypes.number,
  mouseMoved: PropTypes.bool,
  currentPage: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired
};

export default Pages;
