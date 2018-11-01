import React from 'react';
// import classnames from 'classnames';
import PropTypes from 'prop-types';
import ReactAnimatedWeather from 'react-animated-weather-updated';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import properCase from '../../Common/properCase';

const styles = theme => ({
  unit: {
    marginLeft: theme.spacing.unit / 2
  }
});

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
    const { classes, theme, state, attributes } = this.props;
    // console.log(state);
    // console.log(attributes);
    return (
      <Grid
        container
        direction="column">
        <Grid item>
          {/* <ReactAnimatedWeather
            icon={state}
            color={theme.palette.text.main}
            size={80}
            animate={true} /> */}

          <Typography variant="h4">
            {attributes.temperature}
          </Typography>
          <Typography className={classes.unit} variant="h5">
            {this.getUnit('temperature')}
          </Typography>

        </Grid>
        <Grid
          container
          direction="column"
          justify="space-between">
          {Object.keys(attributes).filter(i => typeof attributes[i] == 'number')
            .map((attribute, i) => {
              return (
                <Grid key={i} item>
                  <Typography variant="subtitle1">
                    {properCase(attribute)}: {attributes[attribute]} {this.getUnit(attribute)}
                  </Typography>
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
  haConfig: PropTypes.object.isRequired,
  state: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Weather);
