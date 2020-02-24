import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { BaseProps } from './Base';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%'
  },
  frame: {
    display: 'block',
    width: '100%',
    height: `calc(100% - ${theme.spacing(2)}px)`,
    border: 0
  }
}));

interface FrameProps extends BaseProps {}

function Frame(props: FrameProps) {
  const classes = useStyles();

  return (
    <iframe
      className={classes.frame}
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
