// @flow
import React, { useEffect } from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import arrayMove from 'array-move';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';

import { ConfigProps, ThemeProps } from '../Configuration/Config';
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
    height: '100%',
    background: theme.palette.background.default
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
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
  handleSetTheme: (theme: ThemeProps) => void;
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
    setHassUrl(null);
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
      className={classes.root}
      onClick={handleMouseMove}
      onMouseMove={handleMouseMove}>
      <Drawer
        {...props}
        currentPage={currentPage}
        userInitials={userInitials}
        editing={editing}
        hassConnected={hassConnected}
        handleHassLogin={handleHassLogin}
        mouseMoved={mouseMoved}
        back={back}
        handleBack={handleBack}
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
        <main className={classes.content}>
          {hassUrl && (
            <HomeAssistant
              url={hassUrl}
              setConnected={setHassConnected}
              setConfig={setHassConfig}
              setEntities={setHassEntities}
            />
          )}
          <Route
            exact
            path="/overview"
            render={(rrProps: RouteComponentProps) => (
              <Overview
                {...rrProps}
                config={props.config}
                editing={editing}
                mouseMoved={mouseMoved}
                hassConfig={hassConfig}
                hassEntities={hassEntities}
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
                {...rrProps}
                config={props.config}
                hassConfig={hassConfig}
                hassEntities={hassEntities}
                back={back}
                handleUpdateConfig={handleUpdateConfig}
                handleSetBack={setBack}
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
