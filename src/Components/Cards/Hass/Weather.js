import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import ReactAnimatedWeather from 'react-animated-weather-updated';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import properCase from '../../Common/properCase';

const styles = theme => ({
  main: {
    display: 'inline-flex',
    alignItems: 'center'
  },
  temperature: {
    display: 'flex'
  },
  unit: {
    marginLeft: theme.spacing.unit / 2
  },
  icon: {
    color: theme.palette.text.icon,
    fontSize: 64
  },
  forecast: {
  },
  forecastItem: {
    width: 60
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
  "windy-variant": "weather-windy-variant",
};

const params = {
  slidesPerView: '5',
  centeredSlides: true,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  }
};

class Weather extends React.Component {

  getUnit = measure => {
    if (this.props.haConfig) {
      const lengthUnit = this.props.haConfig.unit_system.length || '';
      switch (measure) {
        case 'air_pressure':
          return lengthUnit === 'km' ? 'hPa' : 'inHg';
        case 'length':
          return lengthUnit;
        case 'precipitation':
          return lengthUnit === 'km' ? 'mm' : 'in';
        default:
          return this.props.haConfig.unit_system[measure] || '';
      }
    } else return null;
  }

  render() {
    const { classes, state, attributes } = this.props;
    const icon = weatherMap[state];

    return (
      <Grid
        container
        direction="column"
        justify="space-between">
        <Grid
          item
          container
          spacing={8}
          direction="row"
          justify="space-between">
          <Grid item xs className={classes.main}>
            <i className={classnames('mdi', `mdi-${icon}`, classes.icon)} />
            <Grid item xs>
              <Typography variant="subtitle1">
                {state}
              </Typography>
              <div className={classes.temperature}>
                <Typography variant="h5">
            {attributes.temperature}
          </Typography>
                <Typography className={classes.unit} variant="subtitle1">
            {this.getUnit('temperature')}
          </Typography>
              </div>
            </Grid>
        </Grid>
          <Grid item xs>
            <div className={classes.attributes}>
              {delete attributes.temperature && Object.keys(attributes).filter(i =>
                typeof attributes[i] == 'number'
              ).map((attribute, i) => {
              return (
                  <Typography key={i} className={classes.attribute} variant="body1">
                    {properCase(attribute)}: {attributes[attribute]} {this.getUnit(attribute)}
                  </Typography>
                );
              })}
            </div>
          </Grid>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    );
  }
}

Weather.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  haConfig: PropTypes.object,
  state: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Weather);
