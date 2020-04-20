import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { BaseProps } from './Base';

const useStyles = makeStyles(() => ({
  textField: {
    width: 'calc(100% - 8px)',
    margin: 4,
  },
}));

function Image(props: BaseProps): ReactElement {
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="center" alignContent="stretch">
      <Grid item xs>
        <TextField
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
          label="URL"
          placeholder="https://timmo.dev/home-panel"
          value={props.card.url || ''}
          onChange={props.handleChange && props.handleChange('url')}
        />
      </Grid>
    </Grid>
  );
}

export default Image;
