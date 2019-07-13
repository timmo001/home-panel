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
import clone from '../Utils/clone';
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
  currentPage: number;
  mouseMoved: boolean;
  setPage: (page: number) => void;
}

function Pages(props: PagesProps) {
  const [editingPage, setEditingPage] = React.useState();

  function handleChange(_event: React.ChangeEvent<{}>, newValue: number) {
    props.setPage(newValue + 1);
  }

  function handleAdd() {
    props.handleUpdateConfig!(
      ['pages', props.config.pages.length],
      defaultPage
    );
  }

  const handleEditingPage = (pageKey: number, page: PageProps) => () => {
    if (props.editing === 1)
      editTimeout = setTimeout(
        () => setEditingPage({ key: pageKey, page }),
        1000
      );
  };

  function handleCancelEdit() {
    clearTimeout(editTimeout);
  }

  function handleDoneEditingPage() {
    setEditingPage(undefined);
  }

  const handleUpdatePage = (pageKey: number) => (data: any) => {
    if (!data) {
      const groups = clone(props.config.items);
      console.log(clone(groups));
      const page = pageKey + 1;
      for (let i = 0; i < groups.length; i++) {
        console.log('before:', i, clone(groups[i]));
        if (groups[i].page === page) groups.splice(i, 1);
        if (groups[i].page > page) groups[i].page -= 1;
        console.log('after:', i, clone(groups[i]));
      }
      console.log(clone(groups));
      props.handleUpdateConfig!(['items'], groups);
      props.setPage(1);
    }
    props.handleUpdateConfig!(['pages', pageKey], data);
  };

  const classes = useStyles();
  return (
    <div>
      <Slide direction="up" in={props.mouseMoved} mountOnEnter unmountOnExit>
        <BottomNavigation
          className={classes.root}
          value={props.currentPage - 1}
          onChange={handleChange}
          showLabels>
          {props.config &&
            props.config.pages.map((page: PageProps, key: number) => (
              <BottomNavigationAction
                key={key}
                value={key}
                label={page.name}
                onMouseDown={handleEditingPage(key, page)}
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
          page={editingPage.page}
          handleClose={handleDoneEditingPage}
          handleUpdate={handleUpdatePage(editingPage.key)}
        />
      )}
    </div>
  );
}

Pages.propTypes = {
  config: PropTypes.any,
  editing: PropTypes.number,
  mouseMoved: PropTypes.bool,
  currentPage: PropTypes.number.isRequired,
  handleUpdateConfig: PropTypes.func,
  setPage: PropTypes.func.isRequired
};

export default Pages;
