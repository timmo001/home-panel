import React, {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";

import { CardProps, ConfigurationProps } from "../Configuration/Config";
import {
  HomeAssistantChangeProps,
  entitySizes,
} from "../HomeAssistant/HomeAssistant";
import { CommandType } from "../Utils/Command";
import Checklist from "./Checklist/Checklist";
import Entity from "../HomeAssistant/Cards/Entity";
import Frame from "./Frame";
import Image from "./Image";
import Markdown from "./Markdown";
import Message from "../Utils/Message";
import News from "./News";
import Overlay from "./Overlay";
import RSS from "./RSS";

const useStyles = makeStyles((theme: Theme) => ({
  buttonExpand: {
    position: "absolute",
    top: theme.spacing(1.2),
    right: theme.spacing(0.8),
  },
  card: {
    flex: 1,
  },
  cardContent: {
    textAlign: "start",
    display: "flex",
    flexDirection: "column",
    "&:last-child": {
      paddingBottom: "initial",
    },
  },
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: "1 1 auto",
    margin: 4,
  },
  title: {
    minHeight: theme.spacing(3),
    userSelect: "none",
    fontWeight: 400,
    lineHeight: 1.2,
  },
  switch: {
    margin: 4,
  },
}));

export interface BaseProps extends HomeAssistantChangeProps {
  card: CardProps;
  command: CommandType;
  config: ConfigurationProps;
  editing: number;
  expandable: boolean;
  maxPosition: number;
  position: number;
  handleCloseExpand?: () => void;
  handleCopy?: () => void;
  handleDelete?: () => void;
  handleMoveDown?: () => void;
  handleMoveUp?: () => void;
  handleUpdate: (data: CardProps) => void;
}

let holdTimeout: NodeJS.Timeout;
function Base(props: BaseProps): ReactElement {
  const [expandable, setExpandable] = useState<boolean>(false);
  const [expandCard, setExpandCard] = useState<boolean>(false);
  const [height, setHeight] = useState<string | number>();
  const [width, setWidth] = useState<string | number>();
  const [toggleable, setToggleable] = useState<boolean>();

  const classes = useStyles();
  const theme = useTheme();

  const handleSetHeight = useCallback(
    (cardSize: number, entitySizeKey?: string) => {
      const h: string | number =
        !props.expandable && entitySizeKey
          ? entitySizes[entitySizeKey].height * cardSize
          : props.editing === 2 || !props.card.height
          ? "initial"
          : !isNaN(Number(props.card.height))
          ? Number(props.card.height) * cardSize || cardSize
          : props.card.height;
      if (h) setHeight(h);
    },
    [props.card.height, props.editing, props.expandable]
  );

  const handleSetWidth = useCallback(
    (cardSize: number, entitySizeKey?: string) => {
      let w =
        !props.expandable && entitySizeKey
          ? entitySizes[entitySizeKey].width * cardSize
          : props.editing === 2 || !props.card.width
          ? -1
          : props.card.width * cardSize || cardSize;
      if (w !== cardSize) {
        // Adjust for margins
        w = props.card.width
          ? w + (props.card.width - 1) * theme.spacing(1)
          : w;
      }
      if (w) setWidth(w);
    },
    [props.card.width, props.editing, props.expandable, theme]
  );

  const handleSetToggleable = useCallback(() => {
    if (props.card.click_action?.type === "call-service") setToggleable(true);
    else
      setToggleable(
        props.editing === 1
          ? false
          : !props.card.disabled && props.card.toggleable
      );
  }, [
    props.card.click_action,
    props.card.disabled,
    props.card.toggleable,
    props.editing,
  ]);

  const handleSetExpandable = useCallback(
    (entitySizeKey: string) => {
      if (entitySizeKey)
        if (props.card.height && props.card.width)
          setExpandable(
            props.card.height < entitySizes[entitySizeKey].height ||
              props.card.width < entitySizes[entitySizeKey].width
          );
        else if (props.card.width)
          setExpandable(props.card.width < entitySizes[entitySizeKey].width);
    },
    [props.card.height, props.card.width]
  );

  useEffect(() => {
    const cardSize = theme.breakpoints.down("sm") ? 140 : 120;

    const entitySizeKey = Object.keys(entitySizes).find(
      (domain: string) => domain === props.card.entity?.split(".")[0]
    );
    handleSetHeight(cardSize, entitySizeKey);
    handleSetWidth(cardSize, entitySizeKey);

    handleSetToggleable();

    if (props.expandable && props.card.type === "entity" && entitySizeKey)
      handleSetExpandable(entitySizeKey);
  }, [
    props.card.entity,
    props.card.type,
    props.expandable,
    theme.breakpoints,
    handleSetExpandable,
    handleSetHeight,
    handleSetToggleable,
    handleSetWidth,
    height,
    width,
  ]);

  function handleHassToggle(): void {
    if (props.handleHassChange) {
      const domain = props.card.entity?.split(".")[0];
      console.log("handleHassToggle", props.card);
      if (
        props.card.click_action &&
        props.card.click_action.type === "call-service" &&
        props.card.click_action.service &&
        props.card.click_action.service_data
      ) {
        const service = props.card.click_action.service.split(".");
        props.handleHassChange(
          service[0],
          service[1],
          JSON.parse(props.card.click_action.service_data)
        );
      } else if (domain) {
        if (domain === "lock") {
          process.env.NODE_ENV === "development" &&
            console.log(props.card.state);
          props.handleHassChange(
            domain,
            props.card.state === "locked" ? "unlock" : "lock",
            {
              entity_id: props.card.entity,
            }
          );
        } else {
          process.env.NODE_ENV === "development" &&
            console.log(domain, props.card.state === "on" ? false : true, {
              entity_id: props.card.entity,
            });
          props.handleHassChange(
            domain,
            props.card.state === "on" ? false : true,
            {
              entity_id: props.card.entity,
            },
            props.hassEntities
          );
        }
      }
    }
  }

  function handleExpand(): void {
    setExpandCard(true);
  }

  function handleCloseExpand(): void {
    setExpandCard(false);
  }

  function handleHoldCancel(): void {
    if (holdTimeout) clearTimeout(holdTimeout);
  }

  function handleHold(): void {
    if (expandable) {
      handleHoldCancel();
      holdTimeout = setTimeout(() => {
        handleExpand();
      }, 1000);
    }
  }

  const card: ReactElement =
    props.card.type === "entity" ? (
      props.hassConnection === -2 ? (
        <Message type="error" text="Home Assistant not connected" />
      ) : props.hassConnection === -1 ? (
        <Message text="Connecting to Home Assistant.." />
      ) : (
        <Entity {...props} handleHassToggle={handleHassToggle} />
      )
    ) : props.card.type === "iframe" ? (
      <Frame {...props} />
    ) : props.card.type === "image" ? (
      <Image {...props} />
    ) : props.card.type === "markdown" ? (
      <Markdown {...props} />
    ) : props.card.type === "news" ? (
      <News {...props} />
    ) : props.card.type === "rss" ? (
      <RSS {...props} />
    ) : props.card.type === "checklist" ? (
      <Checklist {...props} />
    ) : (
      <Fragment />
    );

  const background = useMemo(
    () =>
      props.card.disabled
        ? theme.palette.error.main
        : props.editing !== 2 && props.card.backgroundTemp
        ? props.card.backgroundTemp
        : props.card.background
        ? props.card.background
        : "",
    [
      props.card.background,
      props.card.backgroundTemp,
      props.card.disabled,
      props.editing,
      theme.palette.error.main,
    ]
  );

  const elevation = useMemo(
    () =>
      props.editing === 2
        ? 0
        : props.card.elevation
        ? Number(props.card.elevation)
        : 1,
    [props.card.elevation, props.editing]
  );

  return (
    <ButtonBase
      component="div"
      disableRipple={!toggleable}
      focusRipple={toggleable}
      style={{
        cursor: !toggleable ? "unset" : "pointer",
        userSelect: !toggleable ? "text" : "none",
      }}
      onClick={toggleable ? handleHassToggle : undefined}
      onTouchStart={handleHold}
      onMouseDown={handleHold}
      onTouchCancel={handleHoldCancel}
      onTouchEnd={handleHoldCancel}
      onMouseUp={handleHoldCancel}
      onMouseLeave={handleHoldCancel}
    >
      <Card
        className={classes.card}
        square={props.card.square}
        elevation={elevation}
        style={{
          background: background,
        }}
      >
        <CardContent
          className={classes.cardContent}
          style={{
            height,
            width,
            minHeight: height,
            minWidth: width,
            maxHeight: height,
            maxWidth: width,
            padding: props.card.padding ? props.card.padding : 12,
          }}
        >
          <Grid container direction="row">
            <Grid item xs>
              {props.card.title && (
                <Typography
                  className={classes.title}
                  align={
                    props.card.title_justify ? props.card.title_justify : "left"
                  }
                  color="textPrimary"
                  variant="h6"
                  component="h3"
                  gutterBottom
                  noWrap
                  style={{ fontSize: props.card.title_size }}
                >
                  {props.card.title}
                </Typography>
              )}
            </Grid>
            <Grid item>
              {!props.expandable && (
                <IconButton
                  aria-label="close"
                  size="small"
                  onClick={props.handleCloseExpand}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Grid>
          </Grid>
          {card}
          {props.editing === 1 && <Overlay {...props} />}
        </CardContent>
      </Card>
      {expandCard && (
        <Dialog
          PaperProps={{ style: { background: "transparent" } }}
          open={expandCard}
          onClose={handleCloseExpand}
        >
          <Grid container justifyContent="center">
            <Base
              {...props}
              expandable={false}
              card={{ ...props.card, height: undefined, width: undefined }}
              handleCloseExpand={handleCloseExpand}
            />
          </Grid>
        </Dialog>
      )}
    </ButtonBase>
  );
}

export default Base;
