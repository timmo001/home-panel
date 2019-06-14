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
  text: {},
  date: {
    fontSize: '2.8rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '2.4rem'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.0rem'
    }
  },
  timePeriod: {
    marginLeft: theme.spacing(1),
    fontSize: '2.4rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '2.0rem'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem'
    }
  }
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
  let timeFormat = props.config.header.time_military ? 'HH:mm' : 'hh:mm_-_a';

  if (timeLocation === dateLocation && props.config.header.date_show)
    timeFormat += `-_-${props.config.header.date_format}`;

  const timeRows = moment()
    .format(timeFormat)
    .split('-_-')
    .map((timeColumn: string) => timeColumn.split('_-_'));

  const time = props.config.header.time_show && (
    <Typography
      className={classes.text}
      color="textPrimary"
      variant="h2"
      component="h2">
      {timeRows[0][0]}
      {timeRows[0][1] && (
        <span className={classes.timePeriod}>{timeRows[0][1]}</span>
      )}
      <br />
      {timeRows[1] && <span className={classes.date}>{timeRows[1][0]}</span>}
    </Typography>
  );

  const date = props.config.header.date_show && (
    <Typography
      className={classes.text}
      color="textPrimary"
      variant="h2"
      component="h1">
      {moment().format(props.config.header.date_format)}
    </Typography>
  );

  let columns: any = ['', '', ''];
  columns[timeLocation] = time;
  if (timeLocation !== dateLocation || !props.config.header.time_show)
    columns[dateLocation] = date;
  const entitiesIndex = columns.findIndex((i: any) => i === '');
  columns[entitiesIndex] = entities;

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
          alignItems="flex-start"
          style={{
            textAlign: key === 2 ? 'end' : key === 1 ? 'center' : 'start'
          }}>
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
