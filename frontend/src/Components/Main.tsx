import React, { useEffect, useState, useMemo, ReactElement } from "react";
import { Auth, HassConfig, HassEntities } from "home-assistant-js-websocket";
import { AuthenticationResult } from "@feathersjs/authentication/lib";
import { makeStyles, Theme } from "@material-ui/core/styles";
import arrayMove from "array-move";
import clsx from "clsx";
import moment from "moment";
import Slide from "@material-ui/core/Slide";

import { CommandType } from "./Utils/Command";
import { ConfigurationProps, ThemeProps } from "./Configuration/Config";
import { parseTokens } from "./HomeAssistant/Utils/Auth";
import { Page, Editing, ProgressState } from "./Types/Types";
import clone from "../utils/clone";
import Configuration from "./Configuration/Configuration";
import Drawer from "./Drawer/Drawer";
import HomeAssistant, {
  handleChange as handleHassChange,
} from "./HomeAssistant/HomeAssistant";
import isObject from "../utils/isObject";
import Loading from "./Utils/Loading";
import Overview from "./Overview/Overview";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    maxHeight: "100%",
    overflowX: "hidden",
    background: theme.palette.background.default,
  },
  content: {
    height: `calc(100% - ${theme.spacing(8)}px)`,
    maxHeight: `calc(100% - ${theme.spacing(8)}px)`,
    padding: theme.spacing(1.5, 2, 0.5, 2),
  },
  contentDenseToolbar: {
    height: `calc(100% - ${theme.spacing(6)}px)`,
    maxHeight: `calc(100% - ${theme.spacing(6)}px)`,
  },
  contentNoToolbar: {
    height: "100%",
    maxHeight: "100%",
  },
  overview: {
    overflow: "hidden",
  },
  toolbar: theme.mixins.toolbar,
  denseToolbar: {
    minHeight: 48,
  },
}));

export interface MainProps {
  command: CommandType;
  currentPage: Page;
  config: ConfigurationProps;
  editing: number;
  loginCredentials: AuthenticationResult;
  mouseMoved: boolean;
  handleConfigChange: (config: ConfigurationProps) => void;
  handleLogout: () => void;
  handleMouseMove: () => Promise<void>;
  handleSetCurrentPage: (page: Page) => void;
  handleSetTheme: (palette: ThemeProps) => void;
}

function Main(props: MainProps): ReactElement {
  const [hassAuth, setHassAuth] = useState<Auth>();
  const [hassConfig, setHassConfig] = useState<HassConfig>();
  const [hassConnection, setHassConnection] = useState<ProgressState>(-2);
  const [hassEntities, setHassEntities] = useState<HassEntities>();
  const [hassUrl, setHassUrl] = useState<string>();
  const [spaceTaken, setSpaceTaken] = useState<number>(0);
  const [editing, setEditing] = useState<Editing>(0);

  useEffect(() => {
    if (window.location.search) parseTokens();
  }, []);

  useEffect(() => {
    if (hassConnection === -2) {
      const haUrl = localStorage.getItem("hass_url");
      if (haUrl) {
        setHassUrl(haUrl);
        setHassConnection(-1);
      }
    }
  }, [hassConnection]);

  function handleUpdateConfig(path: (string | number)[], data?: unknown): void {
    if (process.env.NODE_ENV === "development")
      console.log("handleUpdateConfig:", path, data);
    let config = clone(props.config);
    if (path.length > 0) {
      // Set the new value
      const lastItem = path.pop();
      const secondLastItem = path.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (o: any, k: any) => (o[k] = o[k] || {}),
        config
      );
      if (process.env.NODE_ENV === "development") {
        console.log("secondLastItem:", secondLastItem);
        console.log("lastItem:", lastItem);
      }
      if (lastItem !== undefined && secondLastItem !== undefined) {
        if (Array.isArray(secondLastItem)) {
          if (data === undefined) secondLastItem.splice(Number(lastItem), 1);
          else if (Array.isArray(data)) {
            arrayMove.mutate(
              secondLastItem,
              Number(lastItem),
              lastItem + data[0]
            );
          } else if (isObject(data)) {
            const newValue = JSON.parse(JSON.stringify(data));
            if (!secondLastItem[Number(lastItem)])
              secondLastItem[Number(lastItem)] = [];
            secondLastItem[Number(lastItem)] = newValue;
          }
        } else secondLastItem[lastItem] = data;
      }
    } else config = data;
    props.handleConfigChange(config);
    if (path.find((i) => i === "theme")) props.handleSetTheme(config.theme);
  }

  async function handleHassLogin(url: string): Promise<void> {
    setHassUrl(url);
    setHassConnection(-1);
  }

  function handleBackupConfig(): void {
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(props.config)], { type: "json" });
    a.href = URL.createObjectURL(file);
    a.download = `home-panel-config-backup-${moment().format(
      "YYYYMMDDHHmmss"
    )}.json`;
    a.click();
  }

  function handleRestoreConfig(): void {
    const input = document.createElement("input");
    input.type = "file";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input.onchange = (e: any): void => {
      if (e && e.target) {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = (readerEvent: ProgressEvent<FileReader>): void => {
          if (readerEvent && readerEvent.target) {
            const content = readerEvent.target.result;
            if (typeof content === "string") {
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
    if (props.command && props.currentPage !== "Overview")
      props.handleSetCurrentPage("Overview");
  }, [props, props.command, props.currentPage]);

  function handleSetEditing(value: Editing) {
    setEditing(value);
  }

  const classes = useStyles();

  if (!props.config) {
    return <Loading text="Loading Config. Please Wait.." />;
  }

  const userInitials =
    props.loginCredentials &&
    props.loginCredentials.username.substring(0, 1).toUpperCase();

  const showToolbar = useMemo(
    () =>
      !props.config.general.autohide_toolbar ||
      props.currentPage === "Configuration"
        ? true
        : false || props.mouseMoved,
    [props.config.general.autohide_toolbar, props.currentPage, props.mouseMoved]
  );

  return (
    <div
      className={clsx(
        classes.root,
        props.currentPage === "Overview" && classes.overview
      )}
      onClick={props.handleMouseMove}
      onTouchMove={props.handleMouseMove}
      onMouseMove={props.handleMouseMove}>
      <Drawer
        {...props}
        editing={editing}
        hassConnection={hassConnection}
        mouseMoved={props.mouseMoved}
        userInitials={userInitials}
        handleHassLogin={handleHassLogin}
        handleSetEditing={handleSetEditing}
        handleSpaceTaken={setSpaceTaken}
      />
      <Slide direction="down" in={showToolbar} mountOnEnter unmountOnExit>
        <div
          className={clsx(
            classes.toolbar,
            props.config.general &&
              props.config.general.dense_toolbar &&
              classes.denseToolbar
          )}
        />
      </Slide>
      {props.config && (
        <main
          className={clsx(
            classes.content,
            props.config.general &&
              props.config.general.dense_toolbar &&
              classes.contentDenseToolbar,
            !showToolbar && classes.contentNoToolbar,
            props.currentPage === "Overview" && classes.overview
          )}
          style={{ marginLeft: spaceTaken }}>
          {hassUrl && (
            <HomeAssistant
              connection={hassConnection}
              url={hassUrl}
              setAuth={setHassAuth}
              setConfig={setHassConfig}
              setConnection={setHassConnection}
              setEntities={setHassEntities}
            />
          )}
          {props.currentPage === "Configuration" ? (
            <Configuration
              {...props}
              editing={editing}
              handleBackupConfig={handleBackupConfig}
              handleRestoreConfig={handleRestoreConfig}
              handleUpdateConfig={handleUpdateConfig}
            />
          ) : (
            <Overview
              {...props}
              editing={editing}
              hassAuth={hassAuth}
              hassConfig={hassConfig}
              hassConnection={hassConnection}
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
