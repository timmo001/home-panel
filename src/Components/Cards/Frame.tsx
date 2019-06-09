// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { CardBaseProps } from './CardBase';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%'
  },
  frame: {
    display: 'block',
    width: '100%',
    height: '100%',
    border: 0
  },
  textField: {
    width: 'calc(100% - 8px)',
    margin: 4
  }
}));

interface FrameProps extends CardBaseProps {}

function Frame(props: FrameProps) {
  const classes = useStyles();

  if (props.editing === 2)
    return (
      <div>
        <TextField
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
          label="URL"
          placeholder="http://timmo.dev/home-panel"
          defaultValue={props.card.url}
          onChange={props.handleChange!('url')}
        />
        <TextField
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
          label="Height"
          placeholder="auto"
          defaultValue={props.card.height}
          onChange={props.handleChange!('height')}
        />
      </div>
    );

  return (
    <div className={classes.root}>
      <iframe
        className={classes.frame}
        style={{ height: props.card.height ? props.card.height : 'auto' }}
        title={props.card.title}
        src={props.card.url}
        sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts allow-presentation"
        allowFullScreen={true}
      />
    </div>
  );
}

Frame.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  handleChange: PropTypes.func
};

export default Frame;
