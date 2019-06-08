// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { ConfigProps, defaultCard } from '../Configuration/Config';
import CardAdd from '../Cards/CardAdd';
import CardBase, { CardBaseProps } from '../Cards/CardBase';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  groupName: {
    // fontSize: '1.9rem'
  }
}));

export type GroupProps = {
  name: string;
  cards: CardBaseProps[];
  page: number;
  width: number;
};

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
  handleUpdateConfig: (path: any[], data: any) => void;
}

function Overview(props: OverviewProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  function handleAdd() {
    const newId: number = props.config.pages![currentPage].cards!.length;
    props.handleUpdateConfig!(
      ['overview', 'pages', currentPage, 'cards', newId],
      defaultCard
    );
  }

  function handleDelete(key: number) {
    props.handleUpdateConfig!(
      ['overview', 'pages', currentPage, 'cards', key],
      undefined
    );
  }

  function handleMoveUp(key: number) {
    props.handleUpdateConfig!(
      ['overview', 'pages', currentPage, 'cards', key],
      [-1]
    );
  }

  function handleMoveDown(key: number) {
    props.handleUpdateConfig!(
      ['overview', 'pages', currentPage, 'cards', key],
      [+1]
    );
  }

  function handleUpdate(key: number, data: any) {
    props.handleUpdateConfig!(
      ['overview', 'pages', currentPage, 'cards', key],
      data
    );
  }

  const groups =
    props.config.items.filter((item: any) => item.page === currentPage) || [];

  const classes = useStyles();

  console.log('groups:', groups);

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
          lg={3}
          md={6}
          sm={8}
          xs={12}
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
          spacing={1}>
          <Typography className={classes.groupName} variant="h5" component="h2">
            {group.name}
          </Typography>
          {group.cards.map((card: CardBaseProps, key: number) => (
            <CardBase
              {...props}
              key={key}
              id={groupKey}
              card={card}
              editing={props.editing}
              hassConfig={props.hassConfig}
              hassEntities={props.hassEntities}
              handleHassChange={props.handleHassChange}
              handleDelete={handleDelete}
              handleMoveUp={handleMoveUp}
              handleMoveDown={handleMoveDown}
              handleUpdate={handleUpdate}
            />
          ))}
        </Grid>
      ))}
      {props.editing === 1 && <CardAdd handleAdd={handleAdd} />}
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
