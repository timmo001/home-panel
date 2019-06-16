// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { CardBaseProps } from './CardBase';
import MarkdownText from '../Utils/MarkdownText';

const useStyles = makeStyles((theme: Theme) => ({
  text: {
    margin: theme.spacing(0, 0.25),
    '&a': {
      color: theme.palette.text.secondary,
      '&:visited': {
        color: theme.palette.text.secondary
      },
      '&:hover': {
        color: theme.palette.text.secondary
      }
    }
  }
}));

interface MarkdownProps extends CardBaseProps {}

function Markdown(props: MarkdownProps) {
  const classes = useStyles();

  return (
    <Typography
      className={classes.text}
      color="textPrimary"
      variant="body1"
      component="span">
      <MarkdownText text={props.card.content} />
    </Typography>
  );
}

Markdown.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  handleChange: PropTypes.func
};

export default Markdown;
