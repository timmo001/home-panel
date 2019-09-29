// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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
  GroupProps,
  CardProps
} from '../Configuration/Config';
import { findGroupIdByGroup, findCardIdByCard } from '../Utils/find';
import { HomeAssistantChangeProps } from '../HomeAssistant/HomeAssistant';
import AddCard from '../Cards/AddCard';
import AddGroup from '../Cards/AddGroup';
import Base from '../Cards/Base';
import ConfirmDialog from '../Utils/ConfirmDialog';
import EditGroup from '../Configuration/EditGroup';
import Header from './Header/Header';
import Pages from './Pages';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
    padding: theme.spacing(0, 1),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0, 0.5)
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0)
    }
  },
  containerNavShown: {
    paddingBottom: theme.spacing(10)
  },
  title: {
    width: '100%',
    userSelect: 'none',
    fontWeight: 300,
    lineHeight: 1.2
  },
  groupsContainer: {
    height: `calc(100% - ${theme.spacing(12)}px)`,
    overflowX: 'auto',
    overflowY: 'hidden'
  },
  groupsContainerNavShown: {
    height: `calc(100% - ${theme.spacing(8)}px)`
  },
  groupContainer: {
    height: '100%',
    width: 'fit-content',
    minWidth: theme.breakpoints.down('sm') ? 140 : 120,
    overflowX: 'hidden',
    overflowY: 'hidden'
  },
  group: {
    marginBottom: theme.spacing(0.5),
    overflowX: 'hidden',
    overflowY: 'auto'
  }
}));

interface OverviewProps
  extends RouteComponentProps,
    ConfigProps,
    HomeAssistantChangeProps {
  mouseMoved: boolean;
}

function Overview(props: OverviewProps) {
  const [currentPage, setCurrentPage] = React.useState(
    props.config.pages[0].key
  );
  const [editingGroup, setEditingGroup] = React.useState();
  const [deleteConfirm, setDeleteConfirm] = React.useState();

  function handleAddGroup() {
    console.log('handleAddGroup:', currentPage);
    props.handleUpdateConfig!(
      ['groups', props.config.groups.length],
      defaultGroup(currentPage)
    );
  }

  const handleAddCard = (groupKey: string) => () => {
    console.log('handleAddCard:', groupKey);
    props.handleUpdateConfig!(
      ['cards', props.config.cards.length],
      defaultCard(groupKey)
    );
  };

  const handleDelete = (group?: GroupProps, card?: CardProps) => () => {
    console.log('handleDelete:', group, card);
    if (card)
      props.handleUpdateConfig!(
        ['cards', findCardIdByCard(props.config, card)],
        undefined
      );
    else if (group) {
      const groupId = findGroupIdByGroup(props.config, group);
      const groupKey = props.config.groups[groupId].key;
      props.config.cards.map((card: CardProps, id: number) => {
        if (card.group === groupKey)
          props.handleUpdateConfig!(['cards', id], undefined);
        return card;
      });
      props.handleUpdateConfig!(['groups', groupId], undefined);
    }
  };

  const handleMoveUp = (group: GroupProps, card?: CardProps) => () => {
    console.log('handleMoveUp:', group, card);
    if (card) {
      const cardId = findCardIdByCard(props.config, card);
      let pos = 0;
      for (let i = cardId - 1; i < props.config.cards.length; i++) {
        pos--;
        if (props.config.cards[i].group === props.config.cards[cardId].group)
          break;
      }
      process.env.NODE_ENV === 'development' &&
        console.log('cardId:', cardId, 'pos:', pos, 'Result:', cardId + pos);

      props.handleUpdateConfig!(['cards', cardId], [pos]);
    } else {
      const groupId = findGroupIdByGroup(props.config, group);
      let pos = 0;
      for (let i = groupId - 1; i < props.config.groups.length; i++) {
        pos--;
        if (props.config.groups[i].page === props.config.groups[groupId].page)
          break;
      }
      process.env.NODE_ENV === 'development' &&
        console.log('groupId:', groupId, 'pos:', pos, 'Result:', groupId + pos);
      props.handleUpdateConfig!(['groups', groupId], [pos]);
    }
  };

  const handleMoveDown = (group: GroupProps, card?: CardProps) => () => {
    console.log('handleMoveDown:', group, card);
    if (card) {
      const cardId = findCardIdByCard(props.config, card);
      let pos = 0;
      for (let i = cardId + 1; i < props.config.cards.length; i++) {
        pos--;
        if (props.config.cards[i].group === props.config.cards[cardId].group)
          break;
      }
      process.env.NODE_ENV === 'development' &&
        console.log('cardId:', cardId, 'pos:', pos, 'Result:', cardId + pos);

      props.handleUpdateConfig!(['cards', cardId], [pos]);

      props.handleUpdateConfig!(
        ['cards', findCardIdByCard(props.config, card)],
        [+1]
      );
    } else {
      const groupId = findGroupIdByGroup(props.config, group);
      let pos = 0;
      for (let i = groupId + 1; i < props.config.groups.length; i++) {
        pos++;
        if (props.config.groups[i].page === props.config.groups[groupId].page)
          break;
      }
      process.env.NODE_ENV === 'development' &&
        console.log('groupId:', groupId, 'pos:', pos, 'Result:', groupId + pos);
      props.handleUpdateConfig!(['groups', groupId], [pos]);
    }
  };

  const handleUpdateCard = (card: CardProps) => (data: CardProps) => {
    console.log('handleUpdateCard:', card, data);
    props.handleUpdateConfig!(
      ['cards', findCardIdByCard(props.config, card)],
      data
    );
  };

  const handleEditingGroup = (group: GroupProps) => () => {
    setEditingGroup(group);
  };

  function handleDoneEditingGroup() {
    setEditingGroup(undefined);
  }

  const handleUpdateGroup = (group: GroupProps) => (data: GroupProps) => {
    console.log('handleUpdateGroup:', group, data);
    props.handleUpdateConfig!(
      ['groups', findGroupIdByGroup(props.config, group)],
      data
    );
  };

  const handleDeleteConfirm = (group: GroupProps) => () => {
    console.log('handleDeleteConfirm:', group);
    setDeleteConfirm(group);
  };

  function handleConfirmClose() {
    setDeleteConfirm(undefined);
  }

  const groups =
    props.config.groups.filter(
      (group: GroupProps) => group.page === currentPage
    ) || [];

  const classes = useStyles();
  const theme = useTheme();

  return (
    <div
      className={classnames(
        classes.container,
        props.mouseMoved && classes.containerNavShown
      )}>
      <Header {...props} />
      <Grid
        className={classnames(
          classes.groupsContainer,
          props.mouseMoved && classes.groupsContainerNavShown
        )}
        item
        container
        direction="column"
        justify="flex-start"
        alignContent="flex-start"
        spacing={1}>
        {groups.map((group: GroupProps, groupKey: number) => {
          if (!group.width) group.width = 2;
          const cards = props.config.cards.filter(
            (card: CardProps) => card.group === group.key
          );
          const groupWidth =
            (theme.breakpoints.down('sm') ? 140 : 120) * group.width +
            group.width * theme.spacing(1.5);
          return (
            <Grid
              className={classes.groupContainer}
              key={groupKey}
              component="section"
              item
              container
              direction="row"
              justify="flex-start"
              alignContent="flex-start"
              style={{
                width: groupWidth
              }}>
              <Grid
                item
                container
                direction="row"
                justify="flex-start"
                alignContent="flex-start">
                <Grid item>
                  <Typography
                    className={classes.title}
                    variant="h4"
                    component="h2"
                    gutterBottom>
                    {group.name}
                  </Typography>
                </Grid>
                {props.editing === 1 && (
                  <Grid
                    item
                    style={{ width: 'fit-content' }}
                    container
                    alignContent="center"
                    justify="flex-end">
                    <IconButton
                      color="primary"
                      onClick={handleEditingGroup(group)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={handleDeleteConfirm(group)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="primary" onClick={handleMoveUp(group)}>
                      <ArrowLeftIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="primary" onClick={handleMoveDown(group)}>
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
              <Grid
                className={classes.group}
                item
                container
                direction="row"
                justify="flex-start"
                alignContent="flex-start"
                spacing={1}>
                {cards.map((card: CardProps, cardKey: number) => {
                  // if (cardCounter >= Number(group.width)) cardCounter = 0;
                  // cardCounter +=
                  //   card.width && !isNaN(Number(card.width))
                  //     ? Number(card.width)
                  //     : 1;
                  // if (group.name === 'Living Room')
                  //   console.log(Number(card.width), card.title, cardCounter);
                  return (
                    <Grid
                      // className={classnames(
                      //   cardCounter >= Number(group.width) && classes.groupBreak
                      // )}
                      key={cardKey}
                      item>
                      <Base
                        {...props}
                        card={card}
                        editing={props.editing}
                        expandable
                        handleDelete={handleDelete(group, card)}
                        handleMoveUp={handleMoveUp(group, card)}
                        handleMoveDown={handleMoveDown(group, card)}
                        handleUpdate={handleUpdateCard(card)}
                      />
                    </Grid>
                  );
                })}
                {props.editing === 1 && (
                  <Grid item>
                    <AddCard handleAdd={handleAddCard(group.key)} />
                  </Grid>
                )}
              </Grid>
            </Grid>
          );
        })}
        {props.editing === 1 && (
          <Grid
            className={classes.groupContainer}
            component="section"
            item
            container
            direction="row"
            justify="flex-start"
            alignContent="flex-start"
            style={{
              width: theme.breakpoints.down('sm') ? 140 : 120
            }}>
            <AddGroup handleAdd={handleAddGroup} />
          </Grid>
        )}
      </Grid>
      {editingGroup && (
        <EditGroup
          group={editingGroup}
          handleClose={handleDoneEditingGroup}
          handleUpdate={handleUpdateGroup(editingGroup)}
        />
      )}
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
