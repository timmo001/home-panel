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

import { ConfigProps, defaultPage, PageProps } from '../Configuration/Config';
import { findPageIdByPage } from '../../Utils/find';
import EditPage from '../Configuration/EditPage';

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

let editTimeout: NodeJS.Timeout;
interface PagesProps extends RouteComponentProps, ConfigProps {
  currentPage: string;
  mouseMoved: boolean;
  setPage: (pageKey: string) => void;
}

function Pages(props: PagesProps) {
  const [editingPage, setEditingPage] = React.useState();

  function handlePageChange(_event: React.ChangeEvent<{}>, pageKey: string) {
    props.setPage(pageKey);
  }

  function handleAdd() {
    const newPage = defaultPage();
    props.handleUpdateConfig!(['pages', props.config.pages.length], newPage);
    props.setPage(newPage.key);
  }

  const handleEditingPage = (page: PageProps) => () => {
    if (props.editing === 1)
      editTimeout = setTimeout(() => setEditingPage(page), 1000);
  };

  function handleCancelEdit() {
    clearTimeout(editTimeout);
  }

  function handleDoneEditingPage() {
    setEditingPage(undefined);
  }

  const handleUpdatePage = (page: PageProps) => (data?: PageProps) => {
    props.handleUpdateConfig!(
      ['pages', findPageIdByPage(props.config, page)],
      data
    );
    props.setPage(props.config.pages[0].key);
  };

  const classes = useStyles();
  return (
    <div>
      <Slide direction="up" in={props.mouseMoved} mountOnEnter unmountOnExit>
        <BottomNavigation
          className={classes.root}
          value={props.currentPage}
          onChange={handlePageChange}
          showLabels>
          {props.config &&
            props.config.pages.map((page: PageProps, key: number) => (
              <BottomNavigationAction
                key={key}
                value={page.key}
                label={page.name}
                onTouchStart={handleEditingPage(page)}
                onMouseDown={handleEditingPage(page)}
                onTouchCancel={handleCancelEdit}
                onTouchEnd={handleCancelEdit}
                onMouseUp={handleCancelEdit}
                onMouseLeave={handleCancelEdit}
                icon={
                  <Typography
                    className={classnames(
                      'mdi',
                      `mdi-${page.icon}`,
                      classes.icon
                    )}
                    variant="h4"
                    component="h5"
                  />
                }
              />
            ))}
          {props.editing === 1 && (
            <BottomNavigationAction
              onClick={handleAdd}
              icon={
                <Typography
                  className={classnames('mdi', 'mdi-plus', classes.icon)}
                  variant="h4"
                  component="h5"
                />
              }
            />
          )}
        </BottomNavigation>
      </Slide>
      {editingPage && (
        <EditPage
          {...props}
          page={editingPage}
          handleClose={handleDoneEditingPage}
          handleUpdate={handleUpdatePage(editingPage)}
        />
      )}
    </div>
  );
}

Pages.propTypes = {
  config: PropTypes.any,
  editing: PropTypes.number,
  mouseMoved: PropTypes.bool,
  currentPage: PropTypes.string.isRequired,
  handleUpdateConfig: PropTypes.func,
  setPage: PropTypes.func.isRequired
};

export default Pages;
