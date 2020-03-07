import React, { ReactElement } from 'react';
import {
  HassEntity,
  HassEntityAttributeBase
} from 'home-assistant-js-websocket';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import { EntityProps } from './Entity';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%'
  },
  text: {
    overflow: 'hidden',
    userSelect: 'none',
    textAlign: 'center',
    textOverflow: 'ellipsis'
  },
  info: {
    width: '100%'
  },
  media: {
    height: 'calc(100% - 62px)',
    width: '100%',
    objectFit: 'scale-down',
    marginBottom: theme.spacing(0.5)
  },
  button: {
    margin: `0 ${theme.spacing(0.5)}px`
  },
  fill: {
    flexGrow: 1
  }
}));

function Media(props: EntityProps): ReactElement | null {
  const classes = useStyles();

  let entity: HassEntity | undefined,
    state: string | undefined,
    attributes:
      | (HassEntityAttributeBase & {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [key: string]: any;
        })
      | undefined;

  if (!props.hassAuth || !props.hassConfig || !props.hassEntities) return null;

  if (props.card.entity) entity = props.hassEntities[props.card.entity];

  if (!entity) {
    props.card.disabled = true;
    state = `${props.card.entity} not found`;
  } else if (!state) {
    props.card.disabled = false;
    state = entity.state;
    attributes = entity.attributes;
    props.card.state = state;
  }

  if (!entity || !attributes)
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
            variant="body2"
            component="h5">
            {state}
          </Typography>
        </Grid>
      </Grid>
    );

  const handleChange = (action: string) => (): void => {
    if (props.handleHassChange && entity)
      switch (action) {
        default:
          break;
        case 'power':
          props.handleHassChange('media_player', 'toggle', {
            entity_id: entity.entity_id
          });
          break;
        case 'play':
          props.handleHassChange('media_player', 'media_play', {
            entity_id: entity.entity_id
          });
          break;
        case 'pause':
          props.handleHassChange('media_player', 'media_pause', {
            entity_id: entity.entity_id
          });
          break;
        case 'next':
          props.handleHassChange('media_player', 'media_next_track', {
            entity_id: entity.entity_id
          });
          break;
        case 'previous':
          props.handleHassChange('media_player', 'media_previous_track', {
            entity_id: entity.entity_id
          });
          break;
        case 'vol_down':
          props.handleHassChange('media_player', 'volume_down', {
            entity_id: entity.entity_id
          });
          break;
        case 'vol_up':
          props.handleHassChange('media_player', 'volume_up', {
            entity_id: entity.entity_id
          });
          break;
      }
  };

  function handleSelectChange(
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ): void {
    if (props.handleHassChange && entity)
      props.handleHassChange('media_player', 'select_source', {
        entity_id: entity.entity_id,
        source: event.target.value
      });
  }

  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      justify="space-between"
      alignContent="center"
      alignItems="center">
      {(!props.card.height || props.card.height > 1) && (
        <div className={classes.info}>
          {attributes.media_title && (
            <Typography className={classes.text} variant="body1" noWrap>
              {attributes.media_title}
              {attributes.media_artist
                ? ` - ${attributes.media_artist}`
                : ` - ${attributes.media_series_title}`}
            </Typography>
          )}
        </div>
      )}
      {(!props.card.height || props.card.height > 1) &&
        attributes.entity_picture && (
          <img
            className={classes.media}
            src={props.hassAuth.data.hassUrl + attributes.entity_picture}
            alt={attributes.media_title}
          />
        )}
      <Grid
        item
        container
        direction="row"
        justify="center"
        alignContent="center"
        alignItems="center">
        {(!props.card.width || props.card.width > 2) && (
          <Grid item>
            <IconButton
              className={classes.button}
              aria-label="Power"
              onClick={handleChange('power')}>
              <PowerSettingsNewIcon fontSize="small" />
            </IconButton>
          </Grid>
        )}
        <Grid
          item
          xs
          container
          direction="row"
          justify="center"
          alignContent="center"
          alignItems="center">
          {(!props.card.width || props.card.width > 1) && state !== 'off' && (
            <IconButton
              className={classes.button}
              aria-label="Volume Down"
              size="small"
              onClick={handleChange('vol_down')}>
              <VolumeDownIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            className={classes.button}
            aria-label="Previous"
            disabled={state !== 'playing' && state !== 'paused'}
            size="small"
            onClick={handleChange('previous')}>
            <SkipPreviousIcon fontSize="small" />
          </IconButton>
          {state === 'playing' ? (
            <Fab
              color="primary"
              aria-label="Pause"
              size="small"
              onClick={handleChange('pause')}>
              <PauseIcon fontSize="small" />
            </Fab>
          ) : state === 'paused' ? (
            <Fab
              color="primary"
              aria-label="Play"
              size="small"
              onClick={handleChange('play')}>
              <PlayArrowIcon fontSize="small" />
            </Fab>
          ) : (
            <Fab color="primary" aria-label="Play" size="small" disabled>
              <PlayArrowIcon fontSize="small" />
            </Fab>
          )}
          <IconButton
            className={classes.button}
            aria-label="Next"
            disabled={state !== 'playing' && state !== 'paused'}
            size="small"
            onClick={handleChange('next')}>
            <SkipNextIcon fontSize="small" />
          </IconButton>
          {(!props.card.width || props.card.width > 1) && state !== 'off' && (
            <IconButton
              className={classes.button}
              aria-label="Volume Up"
              size="small"
              onClick={handleChange('vol_up')}>
              <VolumeUpIcon fontSize="small" />
            </IconButton>
          )}
        </Grid>
        {(!props.card.width || props.card.width > 2) && (
          <Grid item>
            <Select
              value={attributes.source}
              disabled={!attributes.source_list || state === 'off'}
              onChange={handleSelectChange}
              inputProps={{
                name: 'source',
                id: 'source'
              }}>
              {attributes.source_list &&
                state !== 'off' &&
                attributes.source_list.map((source: string, key: number) => (
                  <MenuItem key={key} value={source}>
                    {source}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default Media;
