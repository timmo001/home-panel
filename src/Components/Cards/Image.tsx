// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { CardBaseProps } from './CardBase';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%'
  },
  dialog: {
    height: '100%',
    width: '100%'
  },
  image: {
    width: '100%',
    marginBottom: -6,
    cursor: 'pointer'
  },
  textField: {
    width: 'calc(100% - 8px)',
    margin: 4
  }
}));

interface ImageProps extends CardBaseProps {}

function Image(props: ImageProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleToggleDialog() {
    setDialogOpen(!dialogOpen);
  }

  const classes = useStyles();

  if (props.editing === 2)
    return (
      <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid item xs>
        <TextField
          className={classes.textField}
          InputLabelProps={{ shrink: true }}
          label="URL"
          placeholder="http://timmo.dev/home-panel"
          defaultValue={props.card.url}
          onChange={props.handleChange!('url')}
        />
        </Grid>
      </Grid>
    );

  return (
    <div className={classes.root} onClick={handleToggleDialog}>
      <img
        className={classes.image}
        src={props.card.url}
        alt={props.card.title}
      />
      {dialogOpen && (
        <Dialog open fullScreen>
          <div className={classes.dialog}>
            <img
              className={classes.image}
              src={props.card.url}
              alt={props.card.title}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
}

Image.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  handleChange: PropTypes.func
};

export default Image;
