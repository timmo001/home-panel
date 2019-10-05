// @flow
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HassEntity } from 'home-assistant-js-websocket';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import { EntityProps } from './Entity';
import properCase from '../../Utils/properCase';

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
  },
  menu: {
    zIndex: 2000
  }
}));

interface SelectProps extends EntityProps {}

let PopoverNode: HTMLButtonElement | null | undefined;
function Select(props: SelectProps) {
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const theme = useTheme();
  let entity: HassEntity | undefined,
    state: string | undefined,
    options: string[] | undefined;

  if (!props.hassEntities) {
    state = 'Home Assistant not connected.';
    props.card.disabled = true;
  } else entity = props.hassEntities[props.card.entity!];

  if (!entity && !state) {
    props.card.disabled = true;
    state = `${props.card.entity} not found`;
  } else if (!state) {
    props.card.disabled = false;
    state = properCase(entity!.state);
    if (entity!.attributes && entity!.attributes.options) {
      options = entity!.attributes.options;
    }
  }

  function handleToggle() {
    setOpen(!open);
  }

  const handleChosen = (option: string) => (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    props.handleHassChange!('input_select', 'select_option', {
      entity_id: props.card.entity,
      option
    });
    setOpen(false);
  };

  return (
    <IconButton
      className={classes.root}
      onClick={handleToggle}
      ref={node => {
        PopoverNode = node;
      }}>
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
        <Grid item xs className={classes.textContainer}>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant={props.card.disabled ? 'body2' : 'body1'}
            component="h5">
            {state}
          </Typography>
        </Grid>
      </Grid>
      <Popover
        className={classes.menu}
        id="options"
        anchorEl={PopoverNode}
        open={open}
        onClose={handleToggle}>
        <Paper
          square
          style={{
            maxHeight: 250,
            width: PopoverNode ? PopoverNode.clientWidth : undefined,
            marginTop: theme.spacing(1),
            overflow: 'auto'
          }}>
          {options &&
            options.map((option: string, key: number) => (
              <MenuItem key={key} onClick={handleChosen(option)} value={option}>
                {option}
              </MenuItem>
            ))}
        </Paper>
      </Popover>
    </IconButton>
  );
}

Select.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default Select;
