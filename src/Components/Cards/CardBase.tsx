// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ArrowDownwardsIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { HomeAssistantChangeProps } from '../HomeAssistant/HomeAssistant';
import ConfirmDialog from '../Utils/ConfirmDialog';
import EditCard from './EditCard';
import Entity from './Entity';
import Frame from './Frame';
import Image from './Image';
import Markdown from './Markdown';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    overflow: 'visible'
  },
  card: {
    position: 'relative',
    height: '100%',
    width: '100%',
    overflow: 'visible',
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
    zIndex: 1000,
    transition: '.4s ease',
    background: `${theme.palette.background.default}dd`,
    opacity: 0,
    '&:hover': {
      opacity: 1
    }
  },
  cardContent: {
    '&:last-child': {
      paddingBottom: '16px'
    }
  },
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: '1 1 auto',
    margin: 4
  },
  title: {},
  switch: {
    margin: 4
  }
}));

export interface CardBaseProps
  extends RouteComponentProps,
    HomeAssistantChangeProps {
  card: any;
  editing: number;
  handleDelete: () => void;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleUpdate?: (data: any) => void;
  handleChange?: (
    name: string
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange?: (
    name: string
  ) => (_event: React.ChangeEvent<{}>, checked: boolean) => void;
  handleSelectChange?: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void;
}

function CardBase(props: CardBaseProps) {
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

  const cardSize = theme.breakpoints.down('sm') ? 120 : 100;

  let height =
    props.editing === 2 ? 'initial' : props.card.height * cardSize || cardSize;
  if (props.card.type !== 'entity') height = -1;
  const width = props.card.width * cardSize || cardSize;

  return (
    <Grid
      className={classes.root}
      item
      xs
      style={{
        height,
        width
      }}>
      <Card
        className={classes.card}
        square={props.card.round ? (props.card.round ? false : true) : false}
        elevation={
          props.editing === 2
            ? 0
            : props.card.elevation
            ? Number(props.card.elevation)
            : 1
        }
        onClick={props.card.toggleable && handleHassToggle}
        style={{
          background:
            props.editing !== 2 &&
            props.card.background &&
            props.card.background
        }}>
        <CardContent
          style={{ padding: props.card.padding ? props.card.padding : 16 }}>
          {props.editing === 2 ? (
            <div>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch">
                <Grid item xs>
                  <TextField
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    label="Title"
                    placeholder={'Card Title'}
                    defaultValue={props.card.title}
                    onChange={props.handleChange!('title')}
                  />
                </Grid>
                <Grid item xs>
                  <FormControl className={classes.textField}>
                    <InputLabel htmlFor="type">Type</InputLabel>
                    <Select
                      // defaultValue={props.card.type}
                      value={props.card.type}
                      onChange={props.handleSelectChange}
                      inputProps={{
                        name: 'type',
                        id: 'type'
                      }}>
                      <MenuItem value="entity">Entity</MenuItem>
                      <MenuItem value="iframe">iFrame</MenuItem>
                      <MenuItem value="image">Image</MenuItem>
                      <MenuItem value="markdown">Markdown</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch">
                <Grid item xs>
                  <TextField
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    label="Elevation"
                    placeholder="1"
                    defaultValue={props.card.elevation}
                    onChange={props.handleChange!('elevation')}
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    label="Background"
                    placeholder="default"
                    defaultValue={props.card.background}
                    onChange={props.handleChange!('background')}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch">
                <Grid item xs>
                  <TextField
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    label="Padding"
                    placeholder="16px"
                    defaultValue={props.card.padding}
                    onChange={props.handleChange!('padding')}
                  />
                </Grid>
                <Grid item xs>
                  <FormControlLabel
                    className={classes.switch}
                    label="Round?"
                    labelPlacement="start"
                    control={<Switch color="primary" />}
                    defaultValue={props.card.round}
                    onChange={props.handleSwitchChange!('round')}
                  />
                </Grid>
              </Grid>
            </div>
          ) : (
            props.card.title && (
              <Typography
                className={classes.title}
                color="textPrimary"
                variant="h5"
                component="h3"
                gutterBottom
                noWrap>
                {props.card.title}
              </Typography>
            )
          )}
          {props.card.type === 'entity' && (
            <Entity
              {...props}
              card={props.card}
              editing={props.editing}
              hassConfig={props.hassConfig}
              hassEntities={props.hassEntities}
              handleChange={props.handleChange!}
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
              justify="center"
              style={
                {
                  // height: props.card.height * cardSize || cardSize,
                  // width: props.card.width * cardSize || cardSize,
                  // margin: -(props.card.padding ? props.card.padding : 16)
                }
              }>
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
            handleClose={handleEditClose}
            handleHassChange={props.handleHassChange}
            handleUpdate={props.handleUpdate}
          />
        )}
      </Card>
    </Grid>
  );
}

CardBase.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any,
  handleHassChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func,
  handleMoveUp: PropTypes.func,
  handleMoveDown: PropTypes.func,
  handleUpdate: PropTypes.func,
  handleChange: PropTypes.func,
  handleSelectChange: PropTypes.func,
  handleSwitchChange: PropTypes.func
};

export default CardBase;
