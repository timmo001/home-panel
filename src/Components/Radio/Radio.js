import React from 'react';
import request from 'superagent';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Sound from 'react-sound';
import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import ButtonBase from '@material-ui/core/ButtonBase';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import RepeatIcon from '@material-ui/icons/Repeat';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import sourcePlaceholder from '../../resources/source.svg';
import InputDialog from './InputDialog';

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2.2,
    left: '50%',
    transform: 'translate(-25%, 100vh) translate(-25%, 0px) !important',
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    zIndex: '1000',
    width: '18rem',
    height: '18rem',
  },
  rootShown: {
    transform: 'translate(-50%, 0px) !important',
  },
  backgroundOuter: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '18rem',
    width: '100%',
  },
  background: {
    maxHeight: '18rem',
  },
  controls: {
    position: 'fixed',
    display: 'flex',
    bottom: theme.spacing.unit * 5.8,
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

class Radio extends React.PureComponent {
  state = {
    source: defaultSource,
    dialogOpen: false,
  };

  handleUpdateRadio = () => console.log('source:', this.state.source);

  handleRadioChange = (action) => {
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
      .post(`${this.props.apiUrl}/radio/get`)
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
    const { handleRadioChange, handleInputDialog, handleInputDialogChange } = this;
    const { classes, show } = this.props;
    const { dialogOpen } = this.state;
    const { source, playing, canSkip, canShuffle, canRepeat } = this.state.source;
    const { image, streams } = source;

    return (
      <Slide direction="up" in={show}>
        <Paper
          className={classNames(classes.root, show && classes.rootShown)}
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
            apiUrl={this.props.apiUrl}
            handleChange={handleInputDialogChange} />
          <div className={classes.controls}>
            <div className={classes.controlsMain}>
              {canRepeat &&
                <Fab
                  className={classes.button}
                  mini
                  color="primary"
                  aria-label="Repeat"
                  onClick={() => handleRadioChange('repeat')}>
                  <RepeatIcon />
                </Fab>
              }
              {canSkip &&
                <Fab
                  className={classes.button}
                  mini
                  color="primary"
                  aria-label="Previous"
                  onClick={() => handleRadioChange('previous')}>
                  <SkipPreviousIcon />
                </Fab>
              }
              {playing === Sound.status.PLAYING ?
                <Fab
                  className={classes.buttonPlay}
                  color="primary"
                  aria-label="Pause"
                  onClick={() => handleRadioChange('pause')}>
                  <PauseIcon />
                </Fab>
                :
                <Fab
                  className={classes.buttonPlay}
                  color="primary"
                  aria-label="Play"
                  onClick={() => handleRadioChange('play')}>
                  <PlayArrowIcon />
                </Fab>
              }
              {canSkip &&
                <Fab
                  className={classes.button}
                  mini
                  color="primary"
                  aria-label="Next"
                  onClick={() => handleRadioChange('next')}>
                  <SkipNextIcon />
                </Fab>
              }
              {canShuffle &&
                <Fab
                  className={classes.button}
                  mini
                  color="primary"
                  aria-label="Shuffle"
                  onClick={() => handleRadioChange('shuffle')}>
                  <ShuffleIcon />
                </Fab>
              }
            </div>
          </div>
        </Paper>
      </Slide>
    );
  }
}

Radio.propTypes = {
  classes: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  apiUrl: PropTypes.string.isRequired,
  handleRadioHide: PropTypes.func.isRequired,
};

export default withStyles(styles)(Radio);
