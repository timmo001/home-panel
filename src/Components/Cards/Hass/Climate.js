import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  temperature: {
    display: 'inline-flex'
  },
  unit: {
    marginLeft: theme.spacing.unit / 2
  }
});

class Weather extends React.Component {

  render() {
    const { classes, haConfig, card, name, state, attributes } = this.props;
    console.log(state);
    console.log(attributes);
    return (
      <Grid
        container
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
            <div className={classes.temperature}>
              <Typography variant="h5">
                {attributes.temperature}
              </Typography>
              <Typography variant="body1" className={classes.unit}>
                {haConfig.unit_system.temperature}
              </Typography>
            </div>
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
  state: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired
};

export default withStyles(styles)(Weather);
