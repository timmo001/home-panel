import React, { useEffect, useCallback, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';
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
import { CommandType } from '../Utils/Command';
import { findGroupIdByGroup, findCardIdByCard } from '../../utils/find';
import { HomeAssistantChangeProps } from '../HomeAssistant/HomeAssistant';
import AddCard from '../Cards/AddCard';
import AddGroup from '../Cards/AddGroup';
import Base from '../Cards/Base';
import ConfirmDialog from '../Utils/ConfirmDialog';
import EditGroup from '../Configuration/EditGroup';
import Header from './Header';
import makeKey from '../../utils/makeKey';
import Pages from './Pages';
import { Auth, HassConfig, HassEntities } from 'home-assistant-js-websocket';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    overflow: 'hidden'
  },
  containerNavShown: {
    paddingBottom: theme.spacing(6.5)
  },
  title: {
    width: '100%',
    userSelect: 'none',
    fontWeight: 300,
    lineHeight: 1.2
  },
  groupsContainer: {
    marginBottom: theme.spacing(0.5),
    overflowX: 'auto',
    overflowY: 'hidden'
  },
  groupContainer: {
    height: '100%',
    minWidth: theme.breakpoints.down('sm') ? 140 : 120,
    overflowX: 'hidden',
    overflowY: 'hidden'
  },
  group: {
    height: `calc(100% - ${theme.spacing(6)}px)`,
    marginBottom: theme.spacing(0.5),
    overflowX: 'hidden',
    overflowY: 'auto'
  }
}));

interface OverviewProps
  extends RouteComponentProps,
    ConfigProps,
    HomeAssistantChangeProps {
  command: CommandType | undefined;
  mouseMoved: boolean;
}

function Overview(props: OverviewProps): ReactElement {
  const [currentPage, setCurrentPage] = React.useState(
    props.config.pages[0].key
  );
  const [editingGroup, setEditingGroup] = React.useState<GroupProps>();
  const [deleteConfirm, setDeleteConfirm] = React.useState<GroupProps>();

  const handleSetCurrentPage = useCallback(
    (page: string) => {
      if (page !== currentPage) setCurrentPage(page);
    },
    [currentPage]
  );

  useEffect(() => {
    if (props.command) {
      if (props.command.page) handleSetCurrentPage(props.command.page);
      else if (props.command.card) {
        const foundCard: CardProps | undefined = props.config.cards.find(
          (card: CardProps) => card.key === props.command!.card
        );
        if (foundCard) {
          const foundGroup: GroupProps | undefined = props.config.groups.find(
            (group: GroupProps) => group.key === foundCard.group
          );
          if (foundGroup) handleSetCurrentPage(foundGroup.page);
        }
      }
    }
  }, [
    props.command,
    props.config.cards,
    props.config.groups,
    handleSetCurrentPage
  ]);

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

  const handleCopy = (card: CardProps) => () => {
    console.log('handleCopy:', card);
    props.handleUpdateConfig!(['cards', props.config.cards.length], {
      ...card,
      key: makeKey(16)
    });
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
      if (groupId) {
        const groupKey = props.config.groups[groupId].key;
        props.config.cards.map((card: CardProps, id: number) => {
          if (card.group === groupKey)
            props.handleUpdateConfig!(['cards', id], undefined);
          return card;
        });
        props.handleUpdateConfig!(['groups', groupId], undefined);
      }
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
    <Grid
      className={classnames(
        classes.container,
        props.mouseMoved && classes.containerNavShown
      )}
      container
      direction="column"
      justify="flex-start"
      alignContent="flex-start">
      <Header {...props} />
      <Grid
        className={classes.groupsContainer}
        item
        xs
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
                <Grid item xs>
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
                {cards.map((card: CardProps, cardKey: number) => (
                  <Grid key={cardKey} item>
                    <Base
                      {...props}
                      card={card}
                      editing={props.editing}
                      expandable
                      handleCopy={handleCopy(card)}
                      handleDelete={handleDelete(group, card)}
                      handleMoveUp={handleMoveUp(group, card)}
                      handleMoveDown={handleMoveDown(group, card)}
                      handleUpdate={handleUpdateCard(card)}
                    />
                  </Grid>
                ))}
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
      <Pages
        {...props}
        currentPage={currentPage}
        setPage={handleSetCurrentPage}
      />
    </Grid>
  );
}

export default Overview;
