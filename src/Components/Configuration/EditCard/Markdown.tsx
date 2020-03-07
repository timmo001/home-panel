import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { BaseProps } from './Base';

const useStyles = makeStyles(() => ({
  textField: {
    width: 'calc(100% - 8px)',
    margin: 4
  }
}));

function Markdown(props: BaseProps): ReactElement {
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="center" alignContent="stretch">
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

export default Markdown;
