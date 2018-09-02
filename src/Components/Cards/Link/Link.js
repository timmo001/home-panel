import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { getCardElevation, getSquareCards } from '../../Utils/config';

const styles = theme => ({
  grid: {
    height: '100%',
    width: 'fit-content',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    flexWrap: 'nowrap',
    overflowY: 'hidden',
  },
  cardContainer: {
    position: 'relative',
    width: '50%',
    padding: theme.spacing.unit / 2,
  },
  cardOuter: {
    height: '100%',
    width: '100%',
    textAlign: 'start',
  },
  card: {
    width: '100%',
    background: theme.palette.backgrounds.card.off,
  },
  cardContent: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 98,
    height: 98,
    [theme.breakpoints.down('sm')]: {
      minHeight: 74,
      height: 74,
    },
    padding: `${theme.spacing.unit * 1.5}px !important`,
  },
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '1.12rem',
    fontColor: theme.palette.text.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    }
  },
  icon: {
    margin: '0 auto',
    color: theme.palette.text.icon,
    fontSize: '2.7rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.7rem',
    }
  },
});

class Link extends React.Component {

  render() {
    const { classes, config, card } = this.props;
    const { name, url } = card;
    const cardElevation = getCardElevation(config);
    const squareCards = getSquareCards(config);
    const icon = card.icon && card.icon;

    return (
      <Grid className={classes.cardContainer} item>
        <ButtonBase
          className={classes.cardOuter}
          focusRipple
          href={url}
          target="_blank">
          <Card className={classes.card} elevation={cardElevation} square={squareCards}>
            <CardContent className={classes.cardContent}>
              <Typography className={classes.name} variant="headline">
                {name}
              </Typography>
              {icon &&
                <i className={classnames('mdi', `mdi-${icon}`, classes.icon)} />
              }
            </CardContent>
          </Card>
        </ButtonBase>
      </Grid>
    );
  }
}

Link.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  card: PropTypes.object.isRequired,
};

export default withStyles(styles)(Link);
