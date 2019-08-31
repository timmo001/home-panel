// @flow
import React, { useEffect } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import arrayMove from 'array-move';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';

import { ConfigProps } from '../Configuration/Config';
import clone from '../Utils/clone';
import Configuration from '../Configuration/Configuration';
import Drawer from '../Drawer/Drawer';
import HomeAssistant, {
  handleChange as handleHassChange
} from '../HomeAssistant/HomeAssistant';
import isObject from '../Utils/isObject';
import Loading from '../Utils/Loading';
import Overview from '../Overview/Overview';
import properCase from '../Utils/properCase';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxHeight: '100%',
    overflowX: 'hidden',
    background: theme.palette.background.default
  },
  content: {
    padding: theme.spacing(2, 2, 1)
  },
  noHeight: {
    height: `calc(100% - ${theme.spacing(1.5)}px)`,
    maxHeight: `calc(100% - ${theme.spacing(1.5)}px)`,
    overflow: 'hidden'
  },
  toolbar: theme.mixins.toolbar,
  denseToolbar: {
    minHeight: 48
  }
}));

interface MainProps extends RouteComponentProps, ConfigProps {
  loggedIn: boolean;
  loginCredentials: any;
  handleLogout(): any;
}

let moveTimeout: NodeJS.Timeout;
function Main(props: MainProps) {
  const [hassUrl, setHassUrl] = React.useState();
  const [hassConnected, setHassConnected] = React.useState(false);
  const [hassConfig, setHassConfig] = React.useState();
  const [hassEntities, setHassEntities] = React.useState();
  const [mouseMoved, setMouseMoved] = React.useState(false);
  const [back, setBack] = React.useState(false);

  useEffect(() => {
    if (!hassConnected) {
      const haUrl = localStorage.getItem('hass_url');
      if (haUrl) setHassUrl(haUrl);
    } else {
      // Clear url if we have been able to establish a connection
      if (props.location.search.includes('auth_callback=1'))
        props.history.replace({ search: '' });
    }
  }, [hassConnected, props.history, props.location.search, props.loggedIn]);

  function handleUpdateConfig(path: any[], data: any) {
    let config = clone(props.config);
    if (path.length > 0) {
      // Set the new value
      const lastItem = path.pop();
      let secondLastItem = path.reduce((o, k) => (o[k] = o[k] || {}), config);
      if (Array.isArray(secondLastItem)) {
        if (data === undefined) secondLastItem.splice(lastItem, 1);
        else if (Array.isArray(data)) {
          arrayMove.mutate(secondLastItem, lastItem, lastItem + data[0]);
        } else if (isObject(data)) {
          const newValue = JSON.parse(JSON.stringify(data));
          if (!secondLastItem[lastItem]) secondLastItem[lastItem] = [];
          secondLastItem[lastItem] = newValue;
        }
      } else secondLastItem[lastItem] = data;
    } else config = data;
    props.handleConfigChange!(config);
  }

  function handleHassLogin(url: string) {
    console.log('handleHassLogin', url);
    setHassUrl(url);
  }

  function handleMouseMove() {
    clearTimeout(moveTimeout);
    if (props.location!.pathname !== '/configuration') {
      setMouseMoved(true);
      moveTimeout = setTimeout(() => setMouseMoved(false), 4000);
    }
  }

  function handleBack() {
    setBack(false);
  }

  const classes = useStyles();

  if (!props.loggedIn) {
    props.history.replace('/login');
    return null;
  }

  if (!props.config) {
    return <Loading text="Loading Config. Please Wait.." />;
  }

  const search =
    props.location!.search && queryString.parse(props.location!.search);
  const editing = search && search.edit && search.edit === 'true' ? 1 : 0;
  const currentPage =
    props.location!.pathname !== '/'
      ? properCase(props.location!.pathname.substring(1))
      : 'Overview';

  const userInitials =
    props.loginCredentials &&
    props.loginCredentials.username.substring(0, 1).toUpperCase();

  const showToolbar =
    !props.config.general.autohide_toolbar ||
    props.location!.pathname === '/configuration' ||
    mouseMoved;

  return (
    <div
      className={classnames(
        classes.root,
        props.location.pathname.includes('overview') && classes.noHeight
      )}
      onClick={handleMouseMove}
      onMouseMove={handleMouseMove}>
      <Drawer
        {...props}
        back={back}
        currentPage={currentPage}
        editing={editing}
        hassConnected={hassConnected}
        mouseMoved={mouseMoved}
        userInitials={userInitials}
        handleBack={handleBack}
        handleHassLogin={handleHassLogin}
      />
      <Slide direction="down" in={showToolbar} mountOnEnter unmountOnExit>
        <div
          className={classnames(
            classes.toolbar,
            props.config.general &&
              props.config.general.dense_toolbar &&
              classes.denseToolbar
          )}
        />
      </Slide>
      {props.config && (
        <main
          className={classnames(
            classes.content,
            props.location.pathname.includes('overview') && classes.noHeight
          )}>
          {hassUrl && (
            <HomeAssistant
              url={hassUrl}
              setConfig={setHassConfig}
              setConnected={setHassConnected}
              setEntities={setHassEntities}
            />
          )}
          <Route
            exact
            path="/overview"
            render={(rrProps: RouteComponentProps) => (
              <Overview
                {...props}
                {...rrProps}
                editing={editing}
                hassConfig={hassConfig}
                hassEntities={hassEntities}
                mouseMoved={mouseMoved}
                handleHassChange={handleHassChange}
                handleUpdateConfig={handleUpdateConfig}
              />
            )}
          />
          <Route
            exact
            path="/configuration"
            render={(rrProps: RouteComponentProps) => (
              <Configuration
                {...props}
                {...rrProps}
                back={back}
                editing={editing}
                hassConfig={hassConfig}
                hassEntities={hassEntities}
                handleSetBack={setBack}
                handleUpdateConfig={handleUpdateConfig}
              />
            )}
          />
        </main>
      )}
    </div>
  );
}

Main.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  loginCredentials: PropTypes.any,
  config: PropTypes.object,
  handleConfigChange: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleSetTheme: PropTypes.func.isRequired
};

export default Main;
