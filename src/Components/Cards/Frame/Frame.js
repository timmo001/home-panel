import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import { getCardElevation, getSquareCards } from '../../Common/config';
import card from '../../Common/Style/card';

const styles = theme => ({
  ...card(theme),
  frame: {
    display: 'block',
    width: '100%',
    height: 'calc(100% - 64px)',
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
        className={classes.cardContainer}
        style={{
          '--width': card.width ?
            typeof card.width === 'number'
              ? `calc(130px * ${card.width})`
              : card.width
            : '260px'
        }}
        item>
        <ButtonBase className={classes.cardOuter} focusRipple>
          <Card className={classes.card} elevation={cardElevation} square={squareCards}>
            <iframe
              className={classes.frame}
              title={name}
              src={url}
              sandbox="allow-forms allow-popups allow-pointer-lock allow-same-origin allow-scripts allow-presentation"
              allowFullScreen={true} />
          </Card>
        </ButtonBase>
      </Grid>
    );
  }
}

Frame.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  card: PropTypes.object.isRequired,
};

export default withStyles(styles)(Frame);
