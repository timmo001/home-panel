// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {
  ConfigProps,
  defaultCard,
  defaultGroup,
  GroupProps
} from '../Configuration/Config';
import AddCard from '../Cards/AddCard';
import AddGroup from '../Cards/AddGroup';
import CardBase, { CardBaseProps } from '../Cards/CardBase';

interface OverviewProps extends RouteComponentProps, ConfigProps {
  config: any;
  editing: number;
  hassConfig: any;
  hassEntities: any;
  handleHassChange: (
    domain: string,
    state: string | boolean,
    data?: any
  ) => void;
}

function Overview(props: OverviewProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

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

  const groups =
    props.config.items.filter((item: any) => item.page === currentPage) || [];

  const theme = useTheme();

  const groupWidth = theme.breakpoints.down('sm') ? 120 : 100;
  return (
    <Grid
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
          direction="column"
          justify="center"
          alignItems="flex-start"
          spacing={1}
          style={{ width: groupWidth * group.width + theme.spacing(1) }}>
          <Typography variant="h5" component="h2">
            {group.name}
          </Typography>
          {group.cards.map((card: CardBaseProps, key: number) => (
            <CardBase
              {...props}
              key={key}
              card={card}
              editing={props.editing}
              hassConfig={props.hassConfig}
              hassEntities={props.hassEntities}
              handleHassChange={props.handleHassChange}
              handleDelete={handleDelete(groupKey, key)}
              handleMoveUp={handleMoveUp(groupKey, key)}
              handleMoveDown={handleMoveDown(groupKey, key)}
              handleUpdate={handleUpdate(groupKey, key)}
            />
          ))}
          {props.editing === 1 && (
            <AddCard handleAdd={handleAddCard(groupKey, group.cards.length)} />
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
