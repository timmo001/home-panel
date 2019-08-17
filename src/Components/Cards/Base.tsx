// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowDownwardsIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { HomeAssistantChangeProps } from '../HomeAssistant/HomeAssistant';
import ConfirmDialog from '../Utils/ConfirmDialog';
import EditCard from '../Configuration/EditCard/EditCard';
import Entity from '../HomeAssistant/Cards/Entity';
import Frame from './Frame';
import Image from './Image';
import Markdown from './Markdown';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    overflow: 'visible'
  },
  card: {
    flex: 1
  },
  cardActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    padding: theme.spacing(1),
    zIndex: 1000,
    transition: '.4s ease',
    background: `${theme.palette.background.default}dd`,
    opacity: 0,
    '&:hover': {
      opacity: 1
    }
  },
  cardContent: {
    textAlign: 'start',
    display: 'flex',
    flexDirection: 'column',
    '&:last-child': {
      paddingBottom: 'initial'
    }
  },
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: '1 1 auto',
    margin: 4
  },
  title: {
    fontWeight: 400,
    lineHeight: 1.2
  },
  switch: {
    margin: 4
  }
}));

export interface BaseProps
  extends RouteComponentProps,
    HomeAssistantChangeProps {
  card: any;
  editing: number;
  handleDelete?: () => void;
  handleMoveDown?: () => void;
  handleMoveUp?: () => void;
  handleUpdate: (data: any) => void;
}

function Base(props: BaseProps) {
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [editCard, setEditCard] = React.useState(false);

  function handleDeleteConfirm() {
    setDeleteConfirm(true);
  }

  function handleConfirmClose() {
    setDeleteConfirm(false);
  }

  function handleHassToggle() {
    console.log(props.card.domain, props.card.state === 'on' ? false : true, {
      entity_id: props.card.entity
    });
    props.handleHassChange!(
      props.card.domain,
      props.card.state === 'on' ? false : true,
      {
        entity_id: props.card.entity
      }
    );
  }

  function handleEdit() {
    setEditCard(true);
  }

  function handleEditClose() {
    setEditCard(false);
  }

  const classes = useStyles();
  const theme = useTheme();

  const cardSize = theme.breakpoints.down('sm') ? 140 : 120;

  let height =
    props.editing === 2 ? 'initial' : props.card.height * cardSize || cardSize;
  if (props.card.type !== 'entity') height = -1;
  let width =
    props.editing === 2 ? -1 : props.card.width * cardSize || cardSize;
  if (width !== cardSize) {
    // Adjust for margins
    width = props.card.width * theme.spacing(1) + width;
  }

  const toggleable =
    props.editing === 1 ? false : !props.card.disabled && props.card.toggleable;

  return (
    <Grid className={classes.root} item>
      <ButtonBase
        component="div"
        disableRipple={!toggleable}
        focusRipple={toggleable}
        style={{
          cursor: !toggleable ? 'unset' : 'pointer',
          userSelect: !toggleable ? 'text' : 'none'
        }}
        onClick={toggleable ? handleHassToggle : undefined}>
        <Card
          className={classes.card}
          square={props.card.square}
          elevation={
            props.editing === 2
              ? 0
              : props.card.elevation
              ? Number(props.card.elevation)
              : 1
          }
          style={{
            background: props.card.disabled
              ? theme.palette.error.main
              : props.editing !== 2 &&
                props.card.background &&
                props.card.background
          }}>
          <CardContent
            className={classes.cardContent}
            style={{
              height,
              width,
              minHeight: height,
              minWidth: width,
              maxHeight: height,
              maxWidth: width,
              padding: props.card.padding ? props.card.padding : 12
            }}>
            {props.card.title && (
              <div>
                <Typography
                  className={classes.title}
                  color="textPrimary"
                  variant="h6"
                  component="h3"
                  gutterBottom
                  noWrap>
                  {props.card.title}
                </Typography>
              </div>
            )}
            {props.card.type === 'entity' && (
              <Entity
                {...props}
                card={props.card}
                editing={props.editing}
                hassConfig={props.hassConfig}
                hassEntities={props.hassEntities}
              />
            )}
            {props.card.type === 'iframe' && <Frame {...props} />}
            {props.card.type === 'image' && <Image {...props} />}
            {props.card.type === 'markdown' && <Markdown {...props} />}
            {props.editing === 1 && (
              <Grid
                className={classes.cardActions}
                container
                alignContent="center"
                justify="center">
                <IconButton color="primary" onClick={handleEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton color="primary" onClick={handleDeleteConfirm}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <IconButton color="primary" onClick={props.handleMoveUp}>
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton color="primary" onClick={props.handleMoveDown}>
                  <ArrowDownwardsIcon fontSize="small" />
                </IconButton>
                {deleteConfirm && (
                  <ConfirmDialog
                    text="Are you sure you want to delete this card?"
                    handleClose={handleConfirmClose}
                    handleConfirm={props.handleDelete}
                  />
                )}
              </Grid>
            )}
          </CardContent>
          {editCard && (
            <EditCard
              {...props}
              card={props.card}
              handleClose={handleEditClose}
              handleUpdate={props.handleUpdate}
            />
          )}
        </Card>
      </ButtonBase>
    </Grid>
  );
}

Base.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  handleChange: PropTypes.func,
  handleDelete: PropTypes.func,
  handleHassChange: PropTypes.func.isRequired,
  handleMoveDown: PropTypes.func,
  handleMoveUp: PropTypes.func,
  handleSelectChange: PropTypes.func,
  handleSwitchChange: PropTypes.func,
  handleUpdate: PropTypes.func.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default Base;
