// @flow
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import { cardStyles } from './CardBase';

const useStyles = makeStyles((theme: Theme) => ({
  ...cardStyles,
  icon: {
    fontSize: 48,
    lineHeight: '78px'
  }
}));

export interface CardAddProps {
  handleAdd: () => void;
}

function CardAdd(props: CardAddProps) {
  const classes = useStyles();
  const theme = useTheme();

  const cardSize = theme.breakpoints.down('sm') ? 120 : 100;
  return (
    <Grid
      item
      style={{
        height: cardSize,
        width: cardSize
      }}>
      <ButtonBase
        className={classes.buttonCardContainer}
        focusRipple
        onClick={props.handleAdd}>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <span className={classnames('mdi', 'mdi-plus', classes.icon)} />
          </CardContent>
        </Card>
      </ButtonBase>
    </Grid>
  );
}

CardAdd.propTypes = {
  handleAdd: PropTypes.func.isRequired
};

export default CardAdd;
