import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import properCase from '../../Common/properCase';

const styles = theme => ({
  main: {
    display: 'inline-flex',
    alignItems: 'center'
  },
  name: {
    margin: 'auto 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '1.12rem',
    lineHeight: '1.34rem',
    color: theme.palette.text.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
      lineHeight: '1.14rem',
    }
  },
  nameSub: {
    margin: 'auto 8px'
  },
  temperature: {
    display: 'flex',
    marginLeft: theme.spacing.unit / 2
  },
  unit: {
    marginLeft: theme.spacing.unit / 2
  },
  icon: {
    color: theme.palette.text.icon,
    fontSize: 52
  },
  attribute: {
    lineHeight: '1.3em'
  },
  forecast: {
    display: 'inline-flex',
    marginTop: theme.spacing.unit,
    overflow: 'auto'
  },
  forecastItem: {
    width: 60,
    marginRight: theme.spacing.unit
  },
  forecastText: {
    lineHeight: '1.24em',
    textAlign: 'center'
  },
  forecastTextIcon: {
    textAlign: 'center'
  },
  forecastIcon: {
    color: theme.palette.text.icon,
    fontSize: 28
  }
});

const weatherMap = {
  "clear-night": "weather-night",
  cloudy: "weather-cloudy",
  fog: "weather-fog",
  hail: "weather-hail",
  lightning: "weather-lightning",
  "lightning-rainy": "weather-lightning-rainy",
  partlycloudy: "weather-partlycloudy",
  pouring: "weather-pouring",
  rainy: "weather-rainy",
  snowy: "weather-snowy",
  "snowy-rainy": "weather-snowy-rainy",
  sunny: "weather-sunny",
  windy: "weather-windy",
  "windy-variant": "weather-windy-variant"
};

const weatherNameMap = {
  "clear-night": "Clear",
  cloudy: "Cloudy",
  fog: "Fog",
  hail: "Hail",
  lightning: "Lightning",
  "lightning-rainy": "Lightning & Rain",
  partlycloudy: "Partly Cloudy",
  pouring: "Rain",
  rainy: "Rain",
  snowy: "Snow",
  "snowy-rainy": "Snow & Rain",
  sunny: "Sunny",
  windy: "Windy",
  "windy-variant": "Windy"
};

class Weather extends React.PureComponent {

  getUnit = measure => {
    if (this.props.haConfig) {
      const lengthUnit = this.props.haConfig.unit_system.length || '';
      switch (measure) {
        case 'pressure':
          return lengthUnit === 'km' ? ' hPa' : ' inHg';
        case 'length':
          return ` ${lengthUnit}`;
        case 'precipitation':
          return lengthUnit === 'km' ? ' mm' : ' in';
        case 'wind_speed':
          return lengthUnit === 'km' ? ' km/h' : ' mph';
        case 'wind_bearing':
          return '°';
        case 'humidity':
          return '%';
        default:
          return this.props.haConfig.unit_system[measure] ?
            ` ${this.props.haConfig.unit_system[measure]}` :
            '';
      }
    } else return null;
  }

  render() {
    const { classes, card, name, state, attributes } = this.props;
    const icon = weatherMap[state];

    return (
      <Grid container>
        <Typography className={classes.name} variant="h5" noWrap>
          {weatherNameMap[state]}
        </Typography>
        {card.width > 1 &&
          <Typography className={classes.nameSub} variant="caption" noWrap>
            {name}
          </Typography>
        }
        <Grid
          item
          container
          spacing={8}
          direction="row"
          justify="space-between">
          <Grid item className={classes.main}>
            <div>
              <span className={classnames('mdi', `mdi-${icon}`, classes.icon)} />
              <div className={classes.temperature}>
                <Typography variant="subtitle1">
                  {attributes.temperature}
                </Typography>
                <Typography className={classes.unit} variant="subtitle1">
                  {this.getUnit('temperature')}
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item>
            <div className={classes.attributes}>
              {Object.keys(attributes).filter(i =>
                typeof attributes[i] == 'number'
              ).map((attribute, i) =>
                attribute !== 'temperature' &&
                attribute !== 'ozone' &&
                <Typography key={i} className={classes.attribute} variant="body1">
                  {properCase(attribute)}: {attributes[attribute]}{this.getUnit(attribute)}
                </Typography>
              )}
            </div>
          </Grid>
        </Grid>
        <div className={classes.forecast}>
          {attributes.forecast.map((w, i) => {
            const datetime = moment(w.datetime);
            const icon = weatherMap[w.condition];
            return (
              <div key={i} className={classes.forecastItem}>
                <Typography noWrap className={classes.forecastText}>
                  {datetime.format('ddd')}<br />
                  {datetime.format('h a')}
                </Typography>

                <Typography className={classes.forecastTextIcon}>
                  <span className={classnames('mdi', `mdi-${icon}`, classes.forecastIcon)} />
                </Typography>

                <Typography noWrap className={classes.forecastText}>
                  {w.temperature}
                  {this.getUnit('temperature')}
                </Typography>
                <Typography noWrap className={classes.forecastText}>
                  {w.precipitation}
                </Typography>
              </div>
            );
          })}
        </div>
      </Grid>
    );
  }
}

Weather.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  haConfig: PropTypes.object,
  card: PropTypes.object.isRequired,
  name: PropTypes.string,
  state: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Weather);
