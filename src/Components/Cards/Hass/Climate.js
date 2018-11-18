import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

const styles = theme => ({
  temperatureContainer: {

  },
  temperature: {
    display: 'inline-flex',
    marginLeft: theme.spacing.unit * 2
  },
  unit: {
    marginLeft: 2
  },
  iconContainer: {
    width: 28,
    padding: 4
  },
  icon: {
    opacity: 0.4
  }
});

class Weather extends React.Component {

  handleTempChange = diff => {
    const newTemp = this.props.attributes.temperature + diff;
    if (newTemp <= this.props.attributes.max_temp
      && newTemp >= this.props.attributes.min_temp)
      this.props.handleChange('climate', 'set_temperature', {
        entity_id: this.props.entity_id,
        temperature: newTemp
      });
  };

  render() {
    const { classes, haConfig, attributes } = this.props;
    // console.log(state);
    console.log(attributes);
    return (
      <Grid
        container
        alignItems="center"
        justify="space-around">
        <Grid item>
          <div className={classes.temperature}>
            <Typography variant="h4">
              {attributes.current_temperature}
            </Typography>
            <Typography variant="subtitle1" className={classes.unit}>
              {haConfig.unit_system.temperature}
            </Typography>
          </div>
        </Grid>
        {attributes.temperature &&
          <Grid item>
            <Grid
              container
              alignItems="center"
              direction="column">
              <IconButton className={classes.iconContainer}
                onClick={() => this.handleTempChange(0.5)}>
                <KeyboardArrowUp fontSize="small" />
              </IconButton>
              <div className={classes.temperature}>
                <Typography variant="h5">
                  {attributes.temperature}
                </Typography>
                <Typography variant="body1" className={classes.unit}>
                  {haConfig.unit_system.temperature}
                </Typography>
              </div>
              <IconButton className={classes.iconContainer}
                onClick={() => this.handleTempChange(-0.5)}>
                <KeyboardArrowDown fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        }
      </Grid>
    );
  }
}

Weather.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  haConfig: PropTypes.object,
  card: PropTypes.object.isRequired,
  entity_id: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default withStyles(styles)(Weather);
