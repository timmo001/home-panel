import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { getCardElevation, getSquareCards } from '../../Common/config';
import grid from '../../Common/Style/grid';
import card from '../../Common/Style/card';

const styles = theme => ({
  ...grid(theme),
  ...card(theme),
});

class Link extends React.Component {

  render() {
    const { classes, config, card } = this.props;
    const { name, url } = card;
    const cardElevation = getCardElevation(config);
    const squareCards = getSquareCards(config);
    const icon = card.icon && card.icon;

    return (
      <Grid
        className={classes.cardContainer}
        style={{
          '--width': card.width ?
            typeof card.width === 'number'
              ? `calc(130px * ${card.width})`
              : card.width
            : '130px'
        }}
        item>
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
