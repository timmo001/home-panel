// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
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
      <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid item xs>
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            multiline
            label="Content"
            placeholder="- Markdown"
            defaultValue={props.card.content}
            onChange={props.handleChange!('content')}
          />
        </Grid>
      </Grid>
    );

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
