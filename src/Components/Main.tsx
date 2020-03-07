import React, { useEffect, ReactElement } from 'react';
import arrayMove from 'array-move';
import classnames from 'classnames';
import moment from 'moment';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';

import { RouteComponentExtendedProps } from './Types/ReactRouter';
import { ConfigProps } from './Configuration/Config';
import { parseTokens } from './HomeAssistant/Utils/Auth';
import { CommandType } from './Utils/Command';
import clone from '../utils/clone';
import Configuration from './Configuration/Configuration';
import Drawer from './Drawer/Drawer';
import HomeAssistant, {
  handleChange as handleHassChange
} from './HomeAssistant/HomeAssistant';
import isObject from '../utils/isObject';
import Loading from './Utils/Loading';
import Overview from './Overview/Overview';
import { Auth, HassConfig, HassEntities } from 'home-assistant-js-websocket';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    maxHeight: '100%',
    overflowX: 'hidden',
    background: theme.palette.background.default
  },
  content: {
    height: `calc(100% - ${theme.spacing(8)}px)`,
    maxHeight: `calc(100% - ${theme.spacing(8)}px)`,
    padding: theme.spacing(1.5, 2, 0.5, 2)
  },
  contentDenseToolbar: {
    height: `calc(100% - ${theme.spacing(6)}px)`,
    maxHeight: `calc(100% - ${theme.spacing(6)}px)`
  },
  contentNoToolbar: {
    height: '100%',
    maxHeight: '100%'
  },
  overview: {
    overflow: 'hidden'
  },
  toolbar: theme.mixins.toolbar,
  denseToolbar: {
    minHeight: 48
  }
}));

interface MainProps extends RouteComponentExtendedProps, ConfigProps {
  command: CommandType | undefined;
  loginCredentials: any;
  mouseMoved: boolean;
  handleLogout: () => any;
  handleMouseMove: () => void;
}

function Main(props: MainProps): ReactElement {
  const [back, setBack] = React.useState<boolean>(false);
  const [hassAuth, setHassAuth] = React.useState<Auth>();
  const [hassConfig, setHassConfig] = React.useState<HassConfig>();
  const [hassConnected, setHassConnected] = React.useState<boolean>(false);
  const [hassEntities, setHassEntities] = React.useState<HassEntities>();
  const [hassLogin, setHassLogin] = React.useState<boolean>(false);
  const [hassUrl, setHassUrl] = React.useState<string>();
  const [spaceTaken, setSpaceTaken] = React.useState<number>(0);

  useEffect(() => {
    if (props.location.search) parseTokens();
  }, [props.location.search]);

  useEffect(() => {
    if (!hassConnected) {
      const haUrl = localStorage.getItem('hass_url');
      if (haUrl) setHassUrl(haUrl);
    }
  }, [hassConnected]);

  function handleUpdateConfig(path: any[], data: any) {
    let config = clone(props.config);
    if (path.length > 0) {
      // Set the new value
      const lastItem = path.pop();
      const secondLastItem = path.reduce((o, k) => (o[k] = o[k] || {}), config);
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
    if (path.find((i: any) => i === 'theme'))
      props.handleSetTheme!(config.theme);
  }

  async function handleHassLogin(url: string) {
    console.log('handleHassLogin:', url);
    setHassUrl(url);
    setHassLogin(true);
  }

  function handleBack() {
    setBack(false);
  }

  function handleBackupConfig() {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(props.config)], { type: 'json' });
    a.href = URL.createObjectURL(file);
    a.download = `home-panel-config-backup-${moment().format(
      'YYYYMMDDHHmmss'
    )}.json`;
    a.click();
  }

  function handleRestoreConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      if (e && e.target) {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
          if (readerEvent && readerEvent.target) {
            const content = readerEvent.target.result;
            if (typeof content === 'string') {
              const json = JSON.parse(content);
              if (json) {
                handleUpdateConfig([], json);
                window.location.reload();
              }
            }
          }
        };
      }
    };
    input.click();
  }

  useEffect(() => {
    if (props.command && !props.location.state!!.overview)
      props.history.replace({ ...props.location, state: { overview: true } });
  }, [props.command, props.history, props.location]);

  const classes = useStyles();

  if (!props.location.state)
    props.history.replace({ ...props.location, state: { overview: true } });

  if (!props.config) {
    return <Loading text="Loading Config. Please Wait.." />;
  }

  const editing = props.location.state && props.location.state.edit ? 1 : 0;
  const currentPage = !props.location.state
    ? 'Overview'
    : props.location.state.configuration
    ? 'Configuration'
    : 'Overview';

  const userInitials =
    props.loginCredentials &&
    props.loginCredentials.username.substring(0, 1).toUpperCase();

  const showToolbar =
    !props.config.general.autohide_toolbar ||
    props.location.state!!.configuration
      ? true
      : false || props.mouseMoved;

  return (
    <div
      className={classnames(
        classes.root,
        props.location.state!!.overview && classes.overview
      )}
      onClick={props.handleMouseMove}
      onTouchMove={props.handleMouseMove}
      onMouseMove={props.handleMouseMove}>
      <Drawer
        {...props}
        back={back}
        currentPage={currentPage}
        editing={editing}
        hassConnected={hassConnected}
        mouseMoved={props.mouseMoved}
        userInitials={userInitials}
        handleBack={handleBack}
        handleHassLogin={handleHassLogin}
        handleSpaceTaken={setSpaceTaken}
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
            props.config.general &&
              props.config.general.dense_toolbar &&
              classes.contentDenseToolbar,
            !showToolbar && classes.contentNoToolbar,
            props.location.state!!.overview && classes.overview
          )}
          style={{ marginLeft: spaceTaken }}>
          {hassUrl && (
            <HomeAssistant
              url={hassUrl}
              login={hassLogin}
              setAuth={setHassAuth}
              setConfig={setHassConfig}
              setConnected={setHassConnected}
              setEntities={setHassEntities}
            />
          )}
          {props.location.state?.configuration &&
          hassAuth &&
          hassConfig &&
          hassEntities ? (
            <Configuration
              {...props}
              back={back}
              editing={editing}
              hassAuth={hassAuth}
              hassConfig={hassConfig}
              hassEntities={hassEntities}
              handleBackupConfig={handleBackupConfig}
              handleRestoreConfig={handleRestoreConfig}
              handleSetBack={setBack}
              handleUpdateConfig={handleUpdateConfig}
            />
          ) : (
            <Overview
              {...props}
              editing={editing}
              hassAuth={hassAuth}
              hassConfig={hassConfig}
              hassEntities={hassEntities}
              mouseMoved={props.mouseMoved}
              handleHassChange={handleHassChange}
              handleUpdateConfig={handleUpdateConfig}
            />
          )}
        </main>
      )}
    </div>
  );
}

export default Main;
