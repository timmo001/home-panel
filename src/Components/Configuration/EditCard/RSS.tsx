import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { BaseProps } from './Base';

const useStyles = makeStyles((_theme: Theme) => ({
  textField: {
    width: 'calc(100% - 8px)',
    margin: 4
  }
}));

interface RSSProps extends BaseProps {}

function RSS(props: RSSProps) {
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="center" alignContent="stretch">
      <Grid item xs>
        <TextField
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
          label="URL"
          placeholder="https://status.home-assistant.io/history.rss"
          value={props.card.url}
          onChange={props.handleChange!('url')}
        />
      </Grid>
      <Grid item xs>
        <TextField
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
          label="Height"
          placeholder="auto"
          value={props.card.height}
          onChange={props.handleChange!('height')}
        />
      </Grid>
    </Grid>
  );
}

RSS.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  handleChange: PropTypes.func
};

export default RSS;
