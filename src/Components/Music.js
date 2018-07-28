// eslint-disable-next-line
import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import RepeatIcon from '@material-ui/icons/Repeat';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import sourcePlaceholder from '../resources/source.png';
import InputDialog from './InputDialog';

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '1000',
    width: '28rem',
    height: '18rem',
    backgroundColor: theme.palette.mainBackground,
  },
  backgroundOuter: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '18rem',
  },
  background: {
    height: '18rem',
  },
  controls: {
    position: 'fixed',
    display: 'flex',
    bottom: theme.spacing.unit * 6.4,
  },
  controlsMain: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'flex-end',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  button: {
    margin: `0 ${theme.spacing.unit}px`,
    marginBottom: theme.spacing.unit / 4,
    backgroundColor: ''
  },
});

const defaultSource = {
  source: {
    image: sourcePlaceholder,
  },
  playing: Sound.status.STOPPED,
  shuffle: false,
  repeat: false,
};

class Music extends React.Component {
  state = {
    source: defaultSource,
    dialogOpen: false,
  };

  handleUpdateMusic = () => {
    console.log('source:', this.state.source);
  };

  handleMusicChange = (action) => {
    console.log('action:', action);
    var source = this.state.source;
    switch (action) {
      default: break;
      case 'play':
        source.playing = Sound.status.PLAYING;
        break;
      case 'pause':
        source.playing = Sound.status.PAUSED;
        break;
      case 'stop':
        source.playing = Sound.status.STOPPED;
        break;
      case 'next':
        break;
      case 'previous':
        break;
      case 'repeat':
        break;
      case 'shuffle':
        break;
    }
    this.setState({ source });
  };

  handleInputDialog = () => {
    this.setState({ dialogOpen: true });
  };

  handleInputDialogChange = (value = null) => {
    var source = this.state.source;
    if (value) source.source = value;
    console.log('source:', source);
    this.setState({ dialogOpen: false, source }, () =>
      this.handleGetSource(this.state.source.source)
    );
  };

  handleGetSource = (source) => {
    request
      .post(`${process.env.REACT_APP_API_URL}/radio/get`)
      .send(source)
      .set('Accept', 'application/json')
      .then(res => {
        var source = this.state.source;
        source.source = res.body;
        source.playing = Sound.status.PLAYING;
        this.setState({ source }, () => console.log('source:', source));
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { handleMusicChange, handleInputDialog, handleInputDialogChange } = this;
    const { classes } = this.props;
    const { dialogOpen } = this.state;
    const { source, playing, canSkip, canShuffle, canRepeat } = this.state.source;
    const { image, streams } = source;

    return (
      <Paper
        className={classes.root}
        square
        elevation={2}>
        {streams &&
          <Sound
            url={streams[0].url}
            playStatus={playing}
            onLoading={this.handleSongLoading}
            onPlaying={this.handleSongPlaying}
            onFinishedPlaying={this.handleSongFinishedPlaying} />
        }
        <ButtonBase
          className={classes.backgroundOuter}
          focusRipple
          onClick={handleInputDialog}>
          <img
            className={classes.background}
            src={image}
            alt="background" />
        </ButtonBase>
        <InputDialog
          open={dialogOpen}
          handleChange={handleInputDialogChange} />
        <div className={classes.controls}>
          <div className={classes.controlsMain}>
            {canRepeat &&
              <Button
                className={classes.button}
                mini
                variant="fab"
                color="primary"
                aria-label="Repeat"
                onClick={() => handleMusicChange('repeat')}>
                <RepeatIcon />
              </Button>
            }
            {canSkip &&
              <Button
                className={classes.button}
                mini
                variant="fab"
                color="primary"
                aria-label="Previous"
                onClick={() => handleMusicChange('previous')}>
                <SkipPreviousIcon />
              </Button>
            }
            {playing === Sound.status.PLAYING ?
              <Button
                className={classes.buttonPlay}
                variant="fab"
                color="primary"
                aria-label="Pause"
                onClick={() => handleMusicChange('pause')}>
                <PauseIcon />
              </Button>
              :
              <Button
                className={classes.buttonPlay}
                variant="fab"
                color="primary"
                aria-label="Play"
                onClick={() => handleMusicChange('play')}>
                <PlayArrowIcon />
              </Button>
            }
            {canSkip &&
              <Button
                className={classes.button}
                mini
                variant="fab"
                color="primary"
                aria-label="Next"
                onClick={() => handleMusicChange('next')}>
                <SkipNextIcon />
              </Button>
            }
            {canShuffle &&
              <Button
                className={classes.button}
                mini
                variant="fab"
                color="primary"
                aria-label="Shuffle"
                onClick={() => handleMusicChange('shuffle')}>
                <ShuffleIcon />
              </Button>
            }
          </div>
        </div>
      </Paper>
    );
  }
}

Music.propTypes = {
  classes: PropTypes.object.isRequired,
  handleMusicHide: PropTypes.func.isRequired,
};

export default withStyles(styles)(Music);