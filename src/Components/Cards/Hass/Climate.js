import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

const styles = theme => ({
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
    opacity: 0.6,
    color: theme.palette.text.icon
  },
  iconActive: {
    opacity: 1.0,
    color: theme.palette.backgrounds.card.on
  },
  hyphen: {
    marginLeft: theme.spacing.unit,
    marginRight: `-${theme.spacing.unit}`
  }
});

class Weather extends React.PureComponent {

  handleTempChange = (type, newTemp) => {
    if (newTemp <= this.props.attributes.max_temp
      && newTemp >= this.props.attributes.min_temp) {
      const data = {
        entity_id: this.props.entity_id,
        [type]: newTemp
      };
      if (type === 'target_temp_low')
        data.target_temp_high = this.props.attributes.target_temp_high;
      else if (type === 'target_temp_high')
        data.target_temp_low = this.props.attributes.target_temp_low;
      this.props.handleChange('climate', 'set_temperature', data);
    }
  };

  handleOperationChange = operation_mode => {
    this.props.handleChange('climate', 'set_operation_mode', {
      entity_id: this.props.entity_id,
      operation_mode
    });
  };

  handleAwayToggle = () => {
    this.props.handleChange('climate', 'set_away_mode', {
      entity_id: this.props.entity_id,
      away_mode: this.props.attributes.away_mode === 'on' ? 'off' : 'on'
    });
  };

  render() {
    const { classes, haConfig, attributes, card } = this.props;
    return (
      <Grid
        container
        spacing={8}
        alignItems="center"
        justify="space-between"
        direction="column">
        <Grid
          container
          alignItems="center"
          justify="space-around"
          direction="row">
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
          {card.width > 1 &&
            <Grid item>
              {attributes.temperature ?
                <Grid
                  container
                  alignItems="center"
                  direction="column">
                  <IconButton className={classes.iconContainer}
                    onClick={() => this.handleTempChange('temperature',
                      attributes.temperature + 0.5)}>
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
                    onClick={() => this.handleTempChange('temperature',
                      attributes.temperature - 0.5)}>
                    <KeyboardArrowDown fontSize="small" />
                  </IconButton>
                </Grid>
                :
                <Grid
                  item
                  container
                  spacing={8}
                  alignItems="center"
                  direction="row">
                  <Grid
                    item
                    xs
                    container
                    alignItems="center"
                    direction="column">
                    <IconButton className={classes.iconContainer}
                      onClick={() => this.handleTempChange('target_temp_low',
                        attributes.target_temp_low + 0.5)}>
                      <KeyboardArrowUp fontSize="small" />
                    </IconButton>
                    <div className={classes.temperature}>
                      <Typography variant="h5">
                        {attributes.target_temp_low}
                      </Typography>
                      <Typography variant="body1" className={classes.unit}>
                        {haConfig.unit_system.temperature}
                      </Typography>
                    </div>
                    <IconButton className={classes.iconContainer}
                      onClick={() => this.handleTempChange('target_temp_low',
                        attributes.target_temp_low - 0.5)}>
                      <KeyboardArrowDown fontSize="small" />
                    </IconButton>
                  </Grid>
                  <Grid item xs className={classes.hyphen}>
                    <Typography variant="h5">-</Typography>
                  </Grid>
                  <Grid
                    item
                    xs
                    container
                    alignItems="center"
                    direction="column">
                    <IconButton className={classes.iconContainer}
                      onClick={() => this.handleTempChange('target_temp_high',
                        attributes.target_temp_high + 0.5)}>
                      <KeyboardArrowUp fontSize="small" />
                    </IconButton>
                    <div className={classes.temperature}>
                      <Typography variant="h5">
                        {attributes.target_temp_high}
                      </Typography>
                      <Typography variant="body1" className={classes.unit}>
                        {haConfig.unit_system.temperature}
                      </Typography>
                    </div>
                    <IconButton className={classes.iconContainer}
                      onClick={() => this.handleTempChange('target_temp_high',
                        attributes.target_temp_high - 0.5)}>
                      <KeyboardArrowDown fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              }
            </Grid>
          }
        </Grid>
        {card.width > 1 && card.height > 1 &&
          <Grid
            container
            spacing={8}
            alignItems="center"
            justify="space-around"
            direction="row">
            <Grid
              item
              xs={8}
              container
              spacing={8}
              alignItems="center"
              justify="center"
              direction="row">
              {attributes.operation_list.map((op, i) =>
                <Grid key={i} item>
                  {op === 'off' ?
                    <IconButton className={classes.iconContainer}
                      onClick={() => this.handleOperationChange(op)}>
                      <i className={classnames('mdi', 'mdi-power-off', classes.icon,
                        attributes.operation_mode === op && classes.iconActive)} />
                    </IconButton>
                    : op === 'heat' ?
                      <IconButton className={classes.iconContainer}
                        onClick={() => this.handleOperationChange(op)}>
                        <i className={classnames('mdi', 'mdi-radiator', classes.icon,
                          attributes.operation_mode === op && classes.iconActive)} />
                      </IconButton>
                      : op === 'cool' ?
                        <IconButton className={classes.iconContainer}
                          onClick={() => this.handleOperationChange(op)}>
                          <i className={classnames('mdi', 'mdi-air-conditioner', classes.icon,
                            attributes.operation_mode === op && classes.iconActive)} />
                        </IconButton>
                        : op === 'auto' ?
                          <IconButton className={classes.iconContainer}
                            onClick={() => this.handleOperationChange(op)}>
                            <i className={classnames('mdi', 'mdi-autorenew', classes.icon,
                              attributes.operation_mode === op && classes.iconActive)} />
                          </IconButton>
                          :
                          <Button className={classnames(classes.button,
                            attributes.operation_mode === op && classes.iconActive)}
                            onClick={() => this.handleOperationChange(op)}>
                            {op}
                          </Button>
                  }
                </Grid>
              )}
            </Grid>
            {attributes.away_mode &&
              <Grid
                item
                xs={4}
                container
                spacing={8}
                alignItems="center"
                justify="space-around"
                direction="row">
                <Grid item>
                  <IconButton className={classes.iconContainer}
                    onClick={() => this.handleAwayToggle()}>
                    <i className={classnames('mdi', 'mdi-walk', classes.icon,
                      attributes.away_mode === 'on' && classes.iconActive)} />
                  </IconButton>
                </Grid>
              </Grid>
            }
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
