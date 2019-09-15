// @flow
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { ConfigProps } from '../../Configuration/Config';
import { HomeAssistantChangeProps } from '../../HomeAssistant/HomeAssistant';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(1)
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(0.5)
    }
  },
  date: {
    fontSize: '2.4rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '2.0rem'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem'
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
    <Typography color="textPrimary" variant="h2" component="h2" noWrap>
      {timeRows[0][0]}
      {timeRows[0][1] && (
        <span className={classes.timePeriod}>{timeRows[0][1]}</span>
      )}
      <br />
      {timeRows[1] && <span className={classes.date}>{timeRows[1][0]}</span>}
    </Typography>
  );

  const date = props.config.header.date_show && (
    <Typography color="textPrimary" variant="h2" component="h2" noWrap>
      {moment().format(props.config.header.date_format)}
    </Typography>
  );

  let columns: any = ['', '', ''];
  columns[timeLocation] = time;
  if (timeLocation !== dateLocation || !props.config.header.time_show)
    columns[dateLocation] = date;

  return (
    <Grid
      className={classes.root}
      item
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      spacing={2}>
      {columns.map((columnData: any, key: number) => (
        <Grid
          key={key}
          item
          xs
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
  hassConfig: PropTypes.any
};

export default Header;
