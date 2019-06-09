// @flow
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { ConfigProps } from '../../Configuration/Config';
import { HomeAssistantChangeProps } from '../../HomeAssistant/HomeAssistant';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  icon: {},
  text: {}
}));

interface HeaderProps extends ConfigProps, HomeAssistantChangeProps {}

function Header(props: HeaderProps) {
  const classes = useStyles();

  const entities = (
    <Grid
      item
      container
      direction="column"
      justify="center"
      alignItems="center">
      {props.config.header.entities.map((entity: any) => (
        <Typography
          className={classes.text}
          color="textPrimary"
          variant="subtitle1"
          component="span">
          {entity.icon && (
            <span className={classnames('mdi', entity.icon, classes.icon)} />
          )}
          {entity.entity &&
            props.hassEntities.find((e: any) => e[0] === entity.entity)[1]
              .state}
        </Typography>
      ))}
    </Grid>
  );

  let timeLocation = props.config.header.time_location;
  let dateLocation = props.config.header.date_location;
  let timeFormat = props.config.header.time_military ? 'HH:mm' : 'hh:mm';

  if (timeLocation === dateLocation)
    timeFormat += ` ${props.config.header.date_format}`;

  const time = (
    <Typography
      className={classes.text}
      color="textPrimary"
      variant="h2"
      component="h1">
      {moment().format(timeFormat)}
    </Typography>
  );

  const date = (
    <Typography
      className={classes.text}
      color="textPrimary"
      variant="h2"
      component="h1">
      {moment().format(props.config.header.date_format)}
    </Typography>
  );

  let columns = [<div />, <div />, <div />];
  columns[timeLocation] = time;
  if (timeLocation !== dateLocation) columns[dateLocation] = date;
  console.log(columns.findIndex((i: any) => i === <div />));
  columns[columns.findIndex((i: any) => i === <div />)] = entities;

  return (
    <Grid
      className={classes.root}
      item
      container
      direction="row"
      justify="flex-start"
      alignItems="center">
      {columns.map((columnData: any, key: number) => (
        <Grid
          key={key}
          item
          xs
          container
          justify={key === 2 ? 'flex-end' : key === 1 ? 'center' : 'flex-start'}
          alignItems="flex-start">
          {columnData}
        </Grid>
      ))}
    </Grid>
  );
}

Header.propTypes = {
  editing: PropTypes.number,
  config: PropTypes.any,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default Header;
