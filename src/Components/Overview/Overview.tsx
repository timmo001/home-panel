// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
import EditGroup from '../Configuration/EditGroup';
import Header from './Header/Header';

const useStyles = makeStyles((_theme: Theme) => ({
  title: {
    fontWeight: 300,
    lineHeight: 1.2
  }
}));

interface OverviewProps
  extends RouteComponentProps,
    ConfigProps,
    HomeAssistantChangeProps {}

function Overview(props: OverviewProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [editingGroup, setEditingGroup] = React.useState();

  const handleAddGroup = (groupKey: number) => () => {
    props.handleUpdateConfig!(['items', groupKey], defaultGroup(currentPage));
  };

  const handleAddCard = (groupKey: number, cardKey: number) => () => {
    props.handleUpdateConfig!(
      ['items', groupKey, 'cards', cardKey],
      defaultCard
    );
  };

  const handleDelete = (groupKey: number, cardKey: number) => () => {
    props.handleUpdateConfig!(['items', groupKey, 'cards', cardKey], undefined);
  };

  const handleMoveUp = (groupKey: number, cardKey: number) => () => {
    props.handleUpdateConfig!(['items', groupKey, 'cards', cardKey], [-1]);
  };

  const handleMoveDown = (groupKey: number, cardKey: number) => () => {
    props.handleUpdateConfig!(['items', groupKey, 'cards', cardKey], [+1]);
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

  const groups =
    props.config.items.filter((item: any) => item.page === currentPage) || [];

  const classes = useStyles();
  const theme = useTheme();

  const groupWidth = theme.breakpoints.down('sm') ? 140 : 120;
  return (
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
        {groups.map((group: GroupProps, groupKey: number) => (
          <Grid
            key={groupKey}
            item
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            style={{ width: groupWidth * group.width + theme.spacing(6.5) }}
            spacing={1}>
            <Grid item xs={12}>
              <ButtonBase
                disabled={props.editing === 1}
                onClick={handleEditingGroup(groupKey, group)}>
                <Typography
                  className={classes.title}
                  variant="h4"
                  component="h2">
                  {group.name}
                </Typography>
              </ButtonBase>
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
        ))}
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
          spacing={1}
          style={{ width: groupWidth * 2 + theme.spacing(1) }}>
          {props.editing === 1 && (
            <AddGroup handleAdd={handleAddGroup(groups.length)} />
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
  );
}

Overview.propTypes = {
  config: PropTypes.any,
  editing: PropTypes.number,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any,
  handleHassChange: PropTypes.func.isRequired,
  handleUpdateConfig: PropTypes.func.isRequired
};

export default Overview;
