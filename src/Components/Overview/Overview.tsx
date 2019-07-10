// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import {
  ConfigProps,
  defaultCard,
  defaultGroup,
  GroupProps
} from '../Configuration/Config';
import { HomeAssistantChangeProps } from '../HomeAssistant/HomeAssistant';
import AddCard from '../Cards/AddCard';
import AddGroup from '../Cards/AddGroup';
import Base, { BaseProps } from '../Cards/Base';
import ConfirmDialog from '../Utils/ConfirmDialog';
import EditGroup from '../Configuration/EditGroup';
import Header from './Header/Header';
import Pages from './Pages';

const useStyles = makeStyles((_theme: Theme) => ({
  title: {
    width: '100%',
    fontWeight: 300,
    lineHeight: 1.2
  }
}));

interface OverviewProps
  extends RouteComponentProps,
    ConfigProps,
    HomeAssistantChangeProps {
  mouseMoved: boolean;
}

function Overview(props: OverviewProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [editingGroup, setEditingGroup] = React.useState();
  const [deleteConfirm, setDeleteConfirm] = React.useState();

  const handleAddGroup = (groupKey: number) => () => {
    props.handleUpdateConfig!(['items', groupKey], defaultGroup(currentPage));
  };

  const handleAddCard = (groupKey: number, cardKey: number) => () => {
    props.handleUpdateConfig!(
      ['items', groupKey, 'cards', cardKey],
      defaultCard
    );
  };

  const handleDelete = (groupKey: number, cardKey?: number) => () => {
    if (cardKey !== undefined)
      props.handleUpdateConfig!(
        ['items', groupKey, 'cards', cardKey],
        undefined
      );
    else props.handleUpdateConfig!(['items', groupKey], undefined);
  };

  const handleMoveUp = (groupKey: number, cardKey?: number) => () => {
    if (cardKey !== undefined) {
      props.handleUpdateConfig!(['items', groupKey, 'cards', cardKey], [-1]);
    } else {
      let pos = 0;
      for (let i = groupKey - 1; i < props.config.items.length; i++) {
        pos--;
        if (props.config.items[i].page === props.config.items[groupKey].page)
          break;
      }
      process.env.NODE_ENV === 'development' &&
        console.log(
          'groupKey:',
          groupKey,
          'pos:',
          pos,
          'Result:',
          groupKey + pos
        );
      props.handleUpdateConfig!(['items', groupKey], [pos]);
    }
  };

  const handleMoveDown = (groupKey: number, cardKey?: number) => () => {
    if (cardKey !== undefined)
      props.handleUpdateConfig!(['items', groupKey, 'cards', cardKey], [+1]);
    else {
      let pos = 0;
      for (let i = groupKey + 1; i < props.config.items.length; i++) {
        pos++;
        if (props.config.items[i].page === props.config.items[groupKey].page)
          break;
      }
      process.env.NODE_ENV === 'development' &&
        console.log(
          'groupKey:',
          groupKey,
          'pos:',
          pos,
          'Result:',
          groupKey + pos
        );
      props.handleUpdateConfig!(['items', groupKey], [pos]);
    }
  };

  const handleUpdate = (groupKey: number, cardKey: number) => (data: any) => {
    props.handleUpdateConfig!(['items', groupKey, 'cards', cardKey], data);
  };

  const handleEditingGroup = (groupKey: number, group: GroupProps) => () => {
    setEditingGroup({ key: groupKey, group });
  };

  function handleDoneEditingGroup() {
    setEditingGroup(undefined);
  }

  const handleUpdateGroup = (groupKey: number) => (data: any) => {
    props.handleUpdateConfig!(['items', groupKey], data);
  };

  const handleDeleteConfirm = (groupKey: number) => () => {
    setDeleteConfirm(groupKey);
  };

  function handleConfirmClose() {
    setDeleteConfirm(undefined);
  }

  const groups =
    props.config.items.filter((item: any) => item.page === currentPage) || [];

  const classes = useStyles();
  const theme = useTheme();

  const groupWidth = theme.breakpoints.down('sm') ? 140 : 120;

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start">
        <Header {...props} />
        <Grid
          item
          xs
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={1}>
          {groups.map((group: GroupProps, key: number) => {
            if (!group.width) group.width = 2;
            const groupKey = props.config.items.findIndex(
              (item: GroupProps) => item === group
            );
            return (
              <Grid
                key={key}
                item
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                style={{ width: groupWidth * group.width + theme.spacing(6.5) }}
                spacing={1}>
                <Grid item xs={12} container>
                  <Grid item>
                    <Typography
                      className={classes.title}
                      variant="h4"
                      component="h2">
                      {group.name}
                    </Typography>
                  </Grid>
                  {props.editing === 1 && (
                    <Grid
                      item
                      xs
                      container
                      alignContent="center"
                      justify="flex-end">
                      <IconButton
                        color="primary"
                        onClick={handleEditingGroup(groupKey, group)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={handleDeleteConfirm(groupKey)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={handleMoveUp(groupKey)}>
                        <ArrowLeftIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={handleMoveDown(groupKey)}>
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                      {deleteConfirm && (
                        <ConfirmDialog
                          text="Are you sure you want to delete this group?"
                          handleClose={handleConfirmClose}
                          handleConfirm={handleDelete(deleteConfirm)}
                        />
                      )}
                    </Grid>
                  )}
                </Grid>
                {group.cards.map((card: BaseProps, key: number) => (
                  <Base
                    {...props}
                    key={key}
                    card={card}
                    editing={props.editing}
                    handleDelete={handleDelete(groupKey, key)}
                    handleMoveUp={handleMoveUp(groupKey, key)}
                    handleMoveDown={handleMoveDown(groupKey, key)}
                    handleUpdate={handleUpdate(groupKey, key)}
                  />
                ))}
                {props.editing === 1 && (
                  <AddCard
                    handleAdd={handleAddCard(groupKey, group.cards.length)}
                  />
                )}
              </Grid>
            );
          })}
          <Grid
            item
            container
            direction="column"
            justify="center"
            alignItems="flex-start"
            spacing={1}
            style={{ width: groupWidth * 2 + theme.spacing(1) }}>
            {props.editing === 1 && (
              <AddGroup handleAdd={handleAddGroup(props.config.items.length)} />
            )}
          </Grid>
        </Grid>
        {editingGroup && (
          <EditGroup
            group={editingGroup.group}
            handleClose={handleDoneEditingGroup}
            handleUpdate={handleUpdateGroup(editingGroup.key)}
          />
        )}
      </Grid>
      <Pages {...props} currentPage={currentPage} setPage={setCurrentPage} />
    </div>
  );
}

Overview.propTypes = {
  config: PropTypes.any,
  editing: PropTypes.number,
  mouseMoved: PropTypes.bool,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any,
  handleHassChange: PropTypes.func.isRequired,
  handleUpdateConfig: PropTypes.func.isRequired
};

export default Overview;
