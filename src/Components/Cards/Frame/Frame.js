import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { getCardElevation, getSquareCards } from '../../Common/config';
import card from '../../Common/Style/card';

const styles = theme => ({
  ...card(theme),
  frameContainer: {
    minHeight: 'var(--height)',
    height: 'var(--height)',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'calc(var(--height) - 48px)',
      height: 'calc(var(--height) - 48px)',
    },
  },
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
        className={classnames(classes.cardContainer, classes.frameContainer)}
        style={{
          '--width': card.width ?
            typeof card.width === 'number'
              ? `${130 * card.width}px`
              : card.width
            : '260px',
          '--height': card.height ?
            typeof card.height === 'number'
              ? `${130 * card.height}px`
              : card.height
            : '260px'
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
  card: PropTypes.object.isRequired,
};

export default withStyles(styles)(Frame);
