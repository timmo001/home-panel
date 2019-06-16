// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { CardBaseProps } from './CardBase';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  frame: {
    display: 'block',
    width: '100%',
    height: '100%',
    border: 0
  }
}));

interface FrameProps extends CardBaseProps {}

function Frame(props: FrameProps) {
  const classes = useStyles();

  return (
    <iframe
      className={classes.frame}
      style={{ height: props.card.height ? props.card.height : 'auto' }}
      title={props.card.title}
      src={props.card.url}
      sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts allow-presentation"
      allowFullScreen={true}
    />
  );
}

Frame.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  handleChange: PropTypes.func
};

export default Frame;
