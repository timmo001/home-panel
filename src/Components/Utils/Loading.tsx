// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
    background: theme.palette.background.default
  },
  text: {
    marginTop: theme.spacing(1),
    userSelect: 'none'
  }
}));

interface LoadingProps {
  text: string;
}

function Loading(props: LoadingProps) {
  const classes = useStyles();
  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      justify="center"
      alignContent="center"
      alignItems="center">
      <CircularProgress size={42} />
      <Typography
        className={classes.text}
        color="textPrimary"
        variant="subtitle1"
        component="h3">
        {props.text}
      </Typography>
    </Grid>
  );
}

Loading.propTypes = {
  text: PropTypes.string
};

export default Loading;
