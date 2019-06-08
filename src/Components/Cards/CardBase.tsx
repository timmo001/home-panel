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

import ConfirmDialog from '../Utils/ConfirmDialog';
import EditCard from './EditCard';
import Entity from './Entity';
import Frame from './Frame';
import Image from './Image';
import Markdown from './Markdown';

export const cardStyles = {
  root: {
    width: '100%',
    overflow: 'visible'
  },
  buttonCardContainer: {
    height: '100%',
    width: '100%',
    flex: 1
  },
  card: {
    height: '100%',
    width: '100%',
    flex: 1,
    overflow: 'visible'
  },
  cardContent: {
    '&:last-child': {
      paddingBottom: '16px'
    }
  },
  textField: {
    flex: '1 1 auto',
    margin: 4
  },
  switch: {
    margin: 4
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  ...cardStyles,
  cardActions: {
    height: '100%',
    width: '100%',
    background: `${theme.palette.background.default}99`
  }
}));

export interface CardBaseProps extends RouteComponentProps {
  id: number;
  card: any;
  editing: number;
  hassConfig: any;
  hassEntities: any;
  handleHassChange: (
    domain: string,
    state: string | boolean,
    data?: any
  ) => void;
  handleDelete?: (key: number) => void;
  handleMoveUp?: (key: number) => void;
  handleMoveDown?: (key: number) => void;
  handleUpdate?: (key: number, value: any) => void;
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

  function handleDelete() {
    props.handleDelete!(props.id);
  }

  function handleMoveUp() {
    props.handleMoveUp!(props.id);
  }

  function handleMoveDown() {
    props.handleMoveDown!(props.id);
  }

  function handleHassToggle() {
    console.log(props.card.domain, props.card.state === 'on' ? false : true, {
      entity_id: props.card.entity
    });
    props.handleHassChange(
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

  let height = props.card.height * cardSize || cardSize;
  if (props.card.type !== 'entity') height = -1;
  const width = props.card.width * cardSize || cardSize;

  return (
    <Grid
      className={classes.root}
      item
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
        onClick={props.card.togglable && handleHassToggle}
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
                alignItems="baseline">
                <TextField
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  label="Title"
                  placeholder={'Card Title'}
                  defaultValue={props.card.title}
                  onChange={props.handleChange!('title')}
                />
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
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="baseline">
                <TextField
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  label="Elevation"
                  placeholder="1"
                  defaultValue={props.card.elevation}
                  onChange={props.handleChange!('elevation')}
                />
                <TextField
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  label="Background"
                  placeholder="default"
                  defaultValue={props.card.background}
                  onChange={props.handleChange!('background')}
                />
                <TextField
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  label="Padding"
                  placeholder="16px"
                  defaultValue={props.card.padding}
                  onChange={props.handleChange!('padding')}
                />
                <FormControlLabel
                  className={classes.switch}
                  label="Round?"
                  labelPlacement="start"
                  control={<Switch color="primary" />}
                  defaultValue={props.card.round}
                  onChange={props.handleSwitchChange!('round')}
                />
              </Grid>
            </div>
          ) : (
            props.card.title && (
              <Typography
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
              style={{
                height: props.card.height * cardSize || cardSize,
                width: props.card.width * cardSize || cardSize,
                margin: -(props.card.padding ? props.card.padding : 16)
              }}>
              <IconButton color="primary" onClick={handleEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton color="primary" onClick={handleDeleteConfirm}>
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton color="primary" onClick={handleMoveUp}>
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <IconButton color="primary" onClick={handleMoveDown}>
                <ArrowDownwardsIcon fontSize="small" />
              </IconButton>
              {deleteConfirm && (
                <ConfirmDialog
                  text="Are you sure you want to delete this card?"
                  handleClose={handleConfirmClose}
                  handleConfirm={handleDelete}
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
  id: PropTypes.number.isRequired,
  card: PropTypes.any.isRequired,
  editing: PropTypes.number.isRequired,
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
