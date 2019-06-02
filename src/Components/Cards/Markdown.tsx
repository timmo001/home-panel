// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import emoji from 'markdown-it-emoji';
import markdownIt from 'markdown-it';
import ReactHtmlParser from 'react-html-parser';

import { CardBaseProps } from './CardBase';

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

  const text = new markdownIt({
    html: true,
    xhtmlOut: true,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: true
  })
    .use(emoji)
    .render(props.card.content);

  return (
    <Typography className={classes.text} color="textPrimary" component="span">
      {ReactHtmlParser(text)}
    </Typography>
  );
}

Markdown.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number.isRequired,
  handleChange: PropTypes.func
};

export default Markdown;
