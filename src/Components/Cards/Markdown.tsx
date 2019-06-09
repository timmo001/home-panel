// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { CardBaseProps } from './CardBase';
import MarkdownText from '../Utils/MarkdownText';

const useStyles = makeStyles((theme: Theme) => ({
  text: {
    '&a': {
      color: theme.palette.text.secondary,
      '&:visited': {
        color: theme.palette.text.secondary
      },
      '&:hover': {
        color: theme.palette.text.secondary
      }
    }
  },
  textField: {
    width: 'calc(100% - 8px)',
    margin: 4
  }
}));

interface MarkdownProps extends CardBaseProps {}

function Markdown(props: MarkdownProps) {
  const classes = useStyles();

  if (props.editing === 2)
    return (
      <TextField
        className={classes.textField}
        InputLabelProps={{ shrink: true }}
        multiline
        label="Content"
        placeholder="- Markdown"
        defaultValue={props.card.content}
        onChange={props.handleChange!('content')}
      />
    );

  return (
    <Typography
      className={classes.text}
      color="textPrimary"
      variant="body2"
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
