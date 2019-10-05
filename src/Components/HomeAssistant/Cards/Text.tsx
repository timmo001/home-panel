// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HassEntity } from 'home-assistant-js-websocket';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

import { EntityProps } from './Entity';

const useStyles = makeStyles((_theme: Theme) => ({
  root: {
    flex: 1
  },
  textContainer: {
    zIndex: 100
  },
  text: {
    overflow: 'hidden',
    userSelect: 'none',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    zIndex: 100
  },
  iconContainer: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  icon: {
    textAlign: 'center'
  }
}));

interface NumberProps extends EntityProps {}

function TextEntity(props: NumberProps) {
  const [text, setText] = React.useState();

  const classes = useStyles();
  let entity: HassEntity | undefined, state: string | undefined;

  if (!props.hassEntities) {
    state = 'Home Assistant not connected.';
    props.card.disabled = true;
  } else entity = props.hassEntities[props.card.entity!];

  if (!entity && !state) {
    props.card.disabled = true;
    state = `${props.card.entity} not found`;
  } else if (!state) {
    props.card.disabled = false;
    state = entity!.state;
  }

  useEffect(() => {
    if (entity) setText(entity.state);
  }, [entity]);

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
            variant="body2"
            component="h5">
            {state}
          </Typography>
        </Grid>
      </Grid>
    );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const val = event.target.value;
    setText(!val ? 0 : val);
    props.handleHassChange!('input_text', 'set_value', {
      entity_id: entity!.entity_id,
      value: val
    });
  }

  return (
    <Grid
      className={classes.root}
      container
      direction="row"
      alignContent="center"
      justify="center">
      <Grid className={classes.iconContainer} item xs={12}>
        {props.card.icon && (
          <Typography
            className={classnames(
              'mdi',
              `mdi-${props.card.icon}`,
              classes.icon
            )}
            color="textPrimary"
            variant="h3"
            component="h5"
            style={{ fontSize: props.card.icon_size }}
          />
        )}
      </Grid>
      {text && (
        <Grid
          className={classes.textContainer}
          item
          container
          direction="row"
          alignContent="center"
          justify="center">
          <Grid item>
            <Input
              value={text}
              margin="dense"
              onChange={handleInputChange}
              inputProps={{
                type: 'text'
              }}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

TextEntity.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default TextEntity;
