import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  iconContainer: {
    height: 28,
    width: 28,
    padding: theme.spacing.unit
  },
  icon: {
    transform: 'translateY(-8px)',
    color: theme.palette.text.icon
  },
  iconDisabled: {
    opacity: 0.6
  }
});

class Cover extends React.PureComponent {
  render() {
    const { classes, entity_id, attributes, card, handleChange } = this.props;
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
            <IconButton
              className={classes.iconContainer}
              disabled={attributes.current_position > 99}
              onClick={() =>
                handleChange('cover', 'open_cover', { entity_id })
              }>
              <span
                className={classNames(
                  'mdi',
                  'mdi-arrow-up',
                  classes.icon,
                  attributes.current_position > 99 && classes.iconDisabled
                )}
              />
            </IconButton>
            <IconButton
              className={classes.iconContainer}
              onClick={() =>
                handleChange('cover', 'stop_cover', { entity_id })
              }>
              <span className={classNames('mdi', 'mdi-stop', classes.icon)} />
            </IconButton>
            <IconButton
              className={classes.iconContainer}
              disabled={attributes.current_position < 1}
              onClick={() =>
                handleChange('cover', 'close_cover', { entity_id })
              }>
              <span
                className={classNames(
                  'mdi',
                  'mdi-arrow-down',
                  classes.icon,
                  attributes.current_position < 1 && classes.iconDisabled
                )}
              />
            </IconButton>
          </Grid>
          {attributes.current_tilt_position !== undefined && card.width > 1 ? (
            <Grid item>
              <IconButton
                className={classes.iconContainer}
                disabled={attributes.current_tilt_position > 99}
                onClick={() =>
                  handleChange('cover', 'open_cover_tilt', { entity_id })
                }>
                <span
                  className={classNames(
                    'mdi',
                    'mdi-arrow-top-right',
                    classes.icon,
                    attributes.current_tilt_position > 99 &&
                      classes.iconDisabled
                  )}
                />
              </IconButton>
              <IconButton
                className={classes.iconContainer}
                onClick={() =>
                  handleChange('cover', 'stop_cover_tilt', { entity_id })
                }>
                <span className={classNames('mdi', 'mdi-stop', classes.icon)} />
              </IconButton>
              <IconButton
                className={classes.iconContainer}
                disabled={attributes.current_tilt_position < 1}
                onClick={() =>
                  handleChange('cover', 'close_cover_tilt', { entity_id })
                }>
                <span
                  className={classNames(
                    'mdi',
                    'mdi-arrow-bottom-left',
                    classes.icon,
                    attributes.current_tilt_position < 1 && classes.iconDisabled
                  )}
                />
              </IconButton>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    );
  }
}

Cover.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  haConfig: PropTypes.object,
  card: PropTypes.object.isRequired,
  entity_id: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default withStyles(styles)(Cover);
