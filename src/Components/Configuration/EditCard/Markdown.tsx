// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { BaseProps } from './Base';

const useStyles = makeStyles((_theme: Theme) => ({
  textField: {
    width: 'calc(100% - 8px)',
    margin: 4
  }
}));

interface MarkdownProps extends BaseProps {}

function Markdown(props: MarkdownProps) {
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="center" alignItems="stretch">
      <Grid item xs>
        <TextField
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
          multiline
          label="Content"
          placeholder="- Markdown"
          value={props.card.content}
          onChange={props.handleChange!('content')}
        />
      </Grid>
    </Grid>
  );
}

Markdown.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  handleChange: PropTypes.func
};

export default Markdown;
