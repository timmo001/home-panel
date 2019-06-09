// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { HomeAssistantChangeProps } from 'Components/HomeAssistant/HomeAssistant';

const useStyles = makeStyles((theme: Theme) => ({
  root: {}
}));

interface HeaderProps extends HomeAssistantChangeProps {
  editing: number;
}

function Header(props: HeaderProps) {
  const classes = useStyles();
  return (
    <Grid
      className={classes.root}
      item
      container
      direction="column"
      justify="center"
      alignItems="center">
      {}
    </Grid>
  );
}

Header.propTypes = {
  editing: PropTypes.number.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default Header;
