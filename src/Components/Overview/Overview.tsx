// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import { ConfigProps, defaultCard } from '../Configuration/Config';
import CardAdd from '../Cards/CardAdd';
import CardBase, { CardBaseProps } from 'Components/Cards/CardBase';
import chunk from '../Utils/chunk';

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
  const [currentPage, setCurrentPage] = React.useState(0);

  const config = props.config.overview!;

  function handleAdd() {
    const newId: number = config.pages![currentPage].cards!.length;
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

  const rows = chunk(config.pages![currentPage].cards!, config.rows || 3);

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="flex-start"
      spacing={1}>
      {rows.map((row: CardBaseProps[], rowKey: number) => (
        <Grid
          key={rowKey}
          item
          lg={3}
          md={6}
          sm={8}
          xs={12}
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={1}>
          {row.map((card: CardBaseProps, key: number) => (
            <CardBase
              {...props}
              key={key}
              id={rowKey * (config.rows || 3) + key}
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
