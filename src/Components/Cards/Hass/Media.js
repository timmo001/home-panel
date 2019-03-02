import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
    width: '100%'
  },
  info: {
    width: '100%'
  },
  media: {
    backgroundSize: 'contain',
    marginBottom: theme.spacing.unit * 4
  },
  controls: {
    display: 'flex'
  },
  controlsMain: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'flex-end',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: theme.spacing.unit
  },
  button: {
    margin: `0 ${theme.spacing.unit / 2}px`
  }
});

class Media extends React.PureComponent {
  handleChange = action => {
    const { entity_id } = this.props;
    switch (action) {
      default:
        break;
      case 'play':
        this.props.handleChange('media_player', 'media_play', { entity_id });
        break;
      case 'pause':
        this.props.handleChange('media_player', 'media_pause', { entity_id });
        break;
      case 'next':
        this.props.handleChange('media_player', 'media_next_track', {
          entity_id
        });
        break;
      case 'previous':
        this.props.handleChange('media_player', 'media_previous_track', {
          entity_id
        });
        break;
      case 'vol_down':
        this.props.handleChange('media_player', 'volume_down', { entity_id });
        break;
      case 'vol_up':
        this.props.handleChange('media_player', 'volume_up', { entity_id });
        break;
    }
  };

  render() {
    const { classes, haUrl, card, state, attributes } = this.props;
    return (
      <div className={classes.root}>
        {card.height > 1 && (
          <div className={classes.info}>
            {attributes.media_title && (
              <Typography variant="body1">
                {attributes.media_title} - {attributes.media_artist}
              </Typography>
            )}
          </div>
        )}
        {card.height > 1 && (
          <CardMedia
            className={classes.media}
            style={{
              height: card.height ? card.height * 60 : 60
            }}
            title={`${attributes.media_title} - ${attributes.media_artist}`}
            image={haUrl + attributes.entity_picture}
          />
        )}
        <div className={classes.controls}>
          <div className={classes.controlsMain}>
            {card.width > 1 && state !== 'off' && (
              <IconButton
                className={classes.button}
                aria-label="Volume Down"
                onClick={() => this.handleChange('vol_down')}>
                <VolumeDownIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              className={classes.button}
              aria-label="Previous"
              disabled={state !== 'playing' && state !== 'paused'}
              onClick={() => this.handleChange('previous')}>
              <SkipPreviousIcon fontSize="small" />
            </IconButton>
            {state === 'playing' ? (
              <Fab
                className={classes.buttonPlay}
                color="primary"
                aria-label="Pause"
                size="small"
                onClick={() => this.handleChange('pause')}>
                <PauseIcon />
              </Fab>
            ) : state === 'paused' ? (
              <Fab
                className={classes.buttonPlay}
                color="primary"
                aria-label="Play"
                size="small"
                onClick={() => this.handleChange('play')}>
                <PlayArrowIcon />
              </Fab>
            ) : (
              <Fab
                className={classes.buttonPlay}
                color="primary"
                aria-label="Play"
                size="small"
                disabled>
                <PlayArrowIcon />
              </Fab>
            )}
            <IconButton
              className={classes.button}
              aria-label="Next"
              disabled={state !== 'playing' && state !== 'paused'}
              onClick={() => this.handleChange('next')}>
              <SkipNextIcon fontSize="small" />
            </IconButton>
            {card.width > 1 && state !== 'off' && (
              <IconButton
                className={classes.button}
                aria-label="Volume Up"
                onClick={() => this.handleChange('vol_up')}>
                <VolumeUpIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Media.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  haUrl: PropTypes.string.isRequired,
  haConfig: PropTypes.object,
  card: PropTypes.object.isRequired,
  state: PropTypes.string.isRequired,
  attributes: PropTypes.object.isRequired,
  entity_id: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default withStyles(styles)(Media);
