import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { getCardElevation, getSquareCards } from '../Common/config';
import grid from '../Common/Style/grid';
import card from '../Common/Style/card';

const styles = theme => ({
  ...grid(theme),
  ...card(theme),
});

class Add extends React.PureComponent {
  render() {
    const { classes, config, handleCardAdd, groupId, cardId, card } = this.props;
    const squareCards = getSquareCards(config);
    const cardElevation = getCardElevation(config);

    return (
      <Grid
        className={classes.cardContainer}
        style={{
          '--width': 1,
          '--height': 1,
        }}
        item>
        <ButtonBase
          className={classes.cardOuter}
          focusRipple
          onClick={() => handleCardAdd(groupId, cardId)}>
          <Card className={classes.card}
            elevation={cardElevation}
            square={squareCards}>
            <CardContent className={classes.cardContent}>
              <span className={classnames('mdi', 'mdi-plus', classes.icon)} style={{
                fontSize: card.size && card.size.state && card.size.state
              }} />
            </CardContent>
          </Card>
        </ButtonBase>
      </Grid>
    );
  }
}

Add.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  handleCardAdd: PropTypes.func.isRequired,
  groupId: PropTypes.number.isRequired,
  cardId: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired
};

export default withStyles(styles)(Add);
