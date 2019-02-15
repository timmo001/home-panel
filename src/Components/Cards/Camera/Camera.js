import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import { getCardElevation, getSquareCards } from '../../Common/config';
import Dialog from './Dialog';
import card from '../../Common/Style/card';

const styles = theme => ({
  ...card(theme),
  cameraCard: {
    height: '100%',
  },
  camera: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
});

class Camera extends React.PureComponent {
  state = {
    camera: undefined
  };

  handleShowCamera = (name, still_url, url) => this.setState({
    camera: { name, still_url, url }
  });

  handleCameraClose = () => this.setState({ camera: undefined });

  render() {
    const { classes, config, card, editing,
      handleCardEdit, groupId, cardId } = this.props;
    const { camera } = this.state;
    const { name, url } = card;
    const still_url = `${card.still_url}?${moment().format('HHmm')}`;
    const cardElevation = getCardElevation(config);
    const squareCards = getSquareCards(config);
    return (
      <Grid
        className={classes.cardContainer}
        style={{
          '--width': card.width ? card.width : 2,
        }}
        item>
        <ButtonBase className={classes.cardOuter} focusRipple
          onClick={() => this.handleShowCamera(name, still_url, url)}>
          <Card className={classnames(classes.card, classes.cameraCard)} elevation={cardElevation} square={squareCards}>
            <img
              className={classes.camera}
              src={still_url}
              alt={name} />
          </Card>
        </ButtonBase>
        {camera &&
          <Dialog
            data={camera}
            handleClose={this.handleCameraClose} />
        }
        {editing &&
          <ButtonBase
            className={classes.editOverlay}
            onClick={() => editing && handleCardEdit(groupId, cardId, card)} />
        }
      </Grid>
    );
  }
}

Camera.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  handleCardEdit: PropTypes.func.isRequired,
  groupId: PropTypes.number.isRequired,
  cardId: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired,
};

export default withStyles(styles)(Camera);
