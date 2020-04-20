import React, { ReactElement } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { EntityProps } from './Entity';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: 1,
  },
  name: {
    margin: theme.spacing(0, 1),
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    fontSize: '1.12rem',
    lineHeight: '1.34rem',
    color: theme.palette.text.primary,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      lineHeight: '1.14rem',
    },
  },
  nameSub: {
    margin: 'auto 8px',
  },
  temperature: {
    display: 'flex',
  },
  icon: {
    color: theme.palette.text.primary,
    fontSize: 64,
    lineHeight: '0.7em',
  },
  attribute: {
    lineHeight: '1.2em',
  },
  forecast: {
    display: 'inline-flex',
    marginTop: theme.spacing(1),
    overflow: 'auto',
  },
  forecastItem: {
    width: 60,
    marginRight: theme.spacing(1),
  },
  forecastText: {
    lineHeight: '1.24em',
    userSelect: 'none',
    textAlign: 'center',
  },
  forecastTextIcon: {
    textAlign: 'center',
  },
  forecastIcon: {
    color: theme.palette.text.primary,
    fontSize: 28,
  },
}));

const weatherMap: { [item: string]: string } = {
  'clear-night': 'weather-night',
  cloudy: 'weather-cloudy',
  fog: 'weather-fog',
  hail: 'weather-hail',
  lightning: 'weather-lightning',
  'lightning-rainy': 'weather-lightning-rainy',
  partlycloudy: 'weather-partly-cloudy',
  pouring: 'weather-pouring',
  rainy: 'weather-rainy',
  snowy: 'weather-snowy',
  'snowy-rainy': 'weather-snowy-rainy',
  sunny: 'weather-sunny',
  windy: 'weather-windy',
  'windy-variant': 'weather-windy-variant',
};

const weatherNameMap: { [item: string]: string } = {
  'clear-night': 'Clear',
  cloudy: 'Cloudy',
  fog: 'Fog',
  hail: 'Hail',
  lightning: 'Lightning',
  'lightning-rainy': 'Lightning & Rain',
  partlycloudy: 'Partly Cloudy',
  pouring: 'Rain',
  rainy: 'Rain',
  snowy: 'Snow',
  'snowy-rainy': 'Snow & Rain',
  sunny: 'Sunny',
  windy: 'Windy',
  'windy-variant': 'Windy',
};

function Weather(props: EntityProps): ReactElement {
  function getUnit(measure: string): string | null {
    if (props.hassConfig) {
      const lengthUnit = props.hassConfig.unit_system.length || '';
      switch (measure) {
        case 'length':
        case 'mass':
        case 'volume':
        case 'temperature':
          return props.hassConfig.unit_system[measure];
        case 'pressure':
          return lengthUnit === 'km' ? ' hPa' : ' inHg';
        case 'precipitation':
          return lengthUnit === 'km' ? ' mm' : ' in';
        case 'wind_speed':
          return lengthUnit === 'km' ? ' km/h' : ' mph';
        case 'wind_bearing':
          return '°';
        case 'humidity':
          return '%';
        default:
          return '';
      }
    } else return null;
  }

  const classes = useStyles();

  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      alignContent="space-around"
      alignItems="center"
      justify="space-around">
      <Grid
        item
        xs
        container
        direction="row"
        alignContent="center"
        alignItems="center"
        justify="center">
        <Grid item>
          <Typography className={classes.forecastTextIcon} variant="body2">
            <span
              className={classnames(
                'mdi',
                `mdi-${weatherMap[props.entity.state]}`,
                classes.icon
              )}
            />
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            textAlign:
              !props.card.width || props.card.width < 1 ? 'center' : 'left',
          }}>
          <Typography
            className={classes.name}
            component="span"
            variant="h5"
            noWrap>
            {weatherNameMap[props.entity.state]}
          </Typography>
          <br />
          <Typography
            className={classes.name}
            component="span"
            variant="h6"
            noWrap>
            {props.entity.attributes.temperature}
            {getUnit('temperature')}
          </Typography>
        </Grid>
      </Grid>
      {(!props.card.width || props.card.width > 1) &&
        (!props.card.height || props.card.height > 1) && (
          <Grid item className={classes.forecast}>
            {props.entity.attributes.forecast.map(
              (
                w: {
                  datetime:
                    | string
                    | number
                    | void
                    | moment.Moment
                    | Date
                    | (string | number)[]
                    | moment.MomentInputObject
                    | undefined;
                  condition: string;
                  temperature: React.ReactNode;
                  precipitation: React.ReactNode;
                },
                key: number
              ) => {
                const datetime = moment(w.datetime);
                const icon = weatherMap[w.condition];
                return (
                  <div key={key} className={classes.forecastItem}>
                    <Typography
                      noWrap
                      className={classes.forecastText}
                      variant="body2">
                      {datetime.format('ddd')}
                      <br />
                      {datetime.format('h a')}
                    </Typography>

                    <Typography
                      className={classes.forecastTextIcon}
                      variant="body2">
                      <span
                        className={classnames(
                          'mdi',
                          `mdi-${icon}`,
                          classes.forecastIcon
                        )}
                      />
                    </Typography>

                    <Typography
                      noWrap
                      className={classes.forecastText}
                      variant="body2">
                      {w.temperature}
                      {getUnit('temperature')}
                    </Typography>
                    <Typography
                      noWrap
                      className={classes.forecastText}
                      variant="body2">
                      {w.precipitation}
                    </Typography>
                  </div>
                );
              }
            )}
          </Grid>
        )}
    </Grid>
  );
}

export default Weather;
