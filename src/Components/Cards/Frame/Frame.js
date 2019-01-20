import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { getCardElevation, getSquareCards } from '../../Common/config';
import card from '../../Common/Style/card';

const styles = theme => ({
  ...card(theme),
  frameInnerContainer: {
    height: '100%'
  },
  frame: {
    display: 'block',
    width: '100%',
    height: '100%',
    border: 0,
  },
});

class Frame extends React.Component {
  render() {
    const { classes, config, card } = this.props;
    const { name, url } = card;
    const cardElevation = getCardElevation(config);
    const squareCards = getSquareCards(config);
    return (
      <Grid
        className={classnames(classes.cardContainer)}
        style={{
          '--width': card.width ? card.width : 1,
          '--height': card.height ? card.height : 1,
        }}
        item>
        <Card className={classes.frameInnerContainer} elevation={cardElevation} square={squareCards}>
          <iframe
            className={classes.frame}
            title={name}
            src={url}
            sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts allow-presentation"
            allowFullScreen={true} />
        </Card>
      </Grid>
    );
  }
}

Frame.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  handleCardEdit: PropTypes.func.isRequired,
  groupId: PropTypes.number.isRequired,
  cardId: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired,
};

export default withStyles(styles)(Frame);
