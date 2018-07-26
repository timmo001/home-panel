// eslint-disable-next-line
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
    height: '16rem',
    backgroundColor: theme.palette.mainBackground,
  },
  backgroundOuter: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '16rem',
  },
  background: {
    height: '16rem',
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

class Music extends React.Component {
  state = {
    playing: false,
    source: {
      image: sourcePlaceholder,
    },
    dialogOpen: false,
  };

  handleMusicChange = (action) => {
    console.log('action:', action);
  };

  handleInputDialog = () => {
    this.setState({ dialogOpen: true });
  };

  handleInputDialogChange = (value) => {
    this.setState({ dialogOpen: false, source: { image: sourcePlaceholder, } });
  };

  render() {
    const { handleMusicChange, handleInputDialog, handleInputDialogChange } = this;
    const { playing, source, dialogOpen } = this.state;
    const { classes, entities, handleChange } = this.props;
    const { image, shuffle, repeat } = source;
    // const domain = entity_id.substring(0, entity_id.indexOf('.'));

    return (
      <Paper
        className={classes.root}
        square
        elevation={2}>
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
          entities={entities}
          handleChange={handleInputDialogChange} />
        <div className={classes.controls}>
          <div className={classes.controlsMain}>
            {repeat &&
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
            <Button
              className={classes.button}
              mini
              variant="fab"
              color="primary"
              aria-label="Previous"
              onClick={() => handleMusicChange('previous')}>
              <SkipPreviousIcon />
            </Button>
            {playing ?
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
            <Button
              className={classes.button}
              mini
              variant="fab"
              color="primary"
              aria-label="Next"
              onClick={() => handleMusicChange('next')}>
              <SkipNextIcon />
            </Button>
            {shuffle &&
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
  entities: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleMusicHide: PropTypes.func.isRequired,
};

export default withStyles(styles)(Music);