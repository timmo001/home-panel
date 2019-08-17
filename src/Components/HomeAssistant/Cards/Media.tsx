// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import { EntityProps } from './Entity';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: 1
  },
  text: {
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis'
  },
  info: {
    width: '100%'
  },
  media: {
    backgroundSize: 'contain',
    marginBottom: theme.spacing(4)
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
    bottom: theme.spacing(1)
  },
  button: {
    margin: `0 ${theme.spacing(0.5)}px`
  }
}));

interface MediaProps extends EntityProps {}

function Media(props: MediaProps) {
  const classes = useStyles();
  let entity: any, state: string | undefined, attributes: any | undefined;

  if (!props.hassEntities) {
    state = 'Home Assistant not connected.';
    props.card.disabled = true;
  } else
    entity = props.hassEntities.find(
      (entity: any) => entity[0] === props.card.entity
    );

  if (!entity && !state) {
    props.card.disabled = true;
    state = `${props.card.entity} not found`;
  } else if (!state) {
    props.card.disabled = false;
    state = entity[1].state;
    attributes = entity[1].attributes;
  }

  if (!entity)
    return (
      <Grid
        className={classes.root}
        container
        direction="row"
        alignContent="center"
        justify="center">
        <Grid item xs>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant="body1"
            component="h5">
            {state}
          </Typography>
        </Grid>
      </Grid>
    );

  function handleChange(action: string) {
    switch (action) {
      default:
        break;
      case 'play':
        props.handleHassChange!('media_player', 'media_play', {
          entity_id: entity[1].entity_id
        });
        break;
      case 'pause':
        props.handleHassChange!('media_player', 'media_pause', {
          entity_id: entity[1].entity_id
        });
        break;
      case 'next':
        props.handleHassChange!('media_player', 'media_next_track', {
          entity_id: entity[1].entity_id
        });
        break;
      case 'previous':
        props.handleHassChange!('media_player', 'media_previous_track', {
          entity_id: entity[1].entity_id
        });
        break;
      case 'vol_down':
        props.handleHassChange!('media_player', 'volume_down', {
          entity_id: entity[1].entity_id
        });
        break;
      case 'vol_up':
        props.handleHassChange!('media_player', 'volume_up', {
          entity_id: entity[1].entity_id
        });
        break;
    }
  }

  return (
    <div className={classes.root}>
      {props.card.height > 1 && (
        <div className={classes.info}>
          {attributes.media_title && (
            <Typography variant="body1" noWrap>
              {attributes.media_title}
              {attributes.media_artist
                ? ` - ${attributes.media_artist}`
                : ` - ${attributes.media_series_title}`}
            </Typography>
          )}
        </div>
      )}
      {props.card.height > 1 && (
        <CardMedia
          className={classes.media}
          style={{
            height: props.card.height ? props.card.height * 78 : 78
          }}
          title={`${attributes.media_title} - ${attributes.media_artist}`}
          image={props.hassConfig.url + attributes.entity_picture}
        />
      )}
      <div className={classes.controls}>
        <div className={classes.controlsMain}>
          {props.card.width > 1 && state !== 'off' && (
            <IconButton
              className={classes.button}
              aria-label="Volume Down"
              onClick={() => handleChange('vol_down')}>
              <VolumeDownIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            className={classes.button}
            aria-label="Previous"
            disabled={state !== 'playing' && state !== 'paused'}
            onClick={() => handleChange('previous')}>
            <SkipPreviousIcon fontSize="small" />
          </IconButton>
          {state === 'playing' ? (
            <Fab
              color="primary"
              aria-label="Pause"
              size="small"
              onClick={() => handleChange('pause')}>
              <PauseIcon />
            </Fab>
          ) : state === 'paused' ? (
            <Fab
              color="primary"
              aria-label="Play"
              size="small"
              onClick={() => handleChange('play')}>
              <PlayArrowIcon />
            </Fab>
          ) : (
            <Fab color="primary" aria-label="Play" size="small" disabled>
              <PlayArrowIcon />
            </Fab>
          )}
          <IconButton
            className={classes.button}
            aria-label="Next"
            disabled={state !== 'playing' && state !== 'paused'}
            onClick={() => handleChange('next')}>
            <SkipNextIcon fontSize="small" />
          </IconButton>
          {props.card.width > 1 && state !== 'off' && (
            <IconButton
              className={classes.button}
              aria-label="Volume Up"
              onClick={() => handleChange('vol_up')}>
              <VolumeUpIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

Media.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default Media;
