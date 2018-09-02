import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import { getCardElevation, getSquareCards } from '../Utils/config';
import CameraDialog from './Camera/Dialog';

const styles = theme => ({
  cameraContainer: {
    position: 'relative',
    width: '100%',
    padding: theme.spacing.unit / 2,
  },
  camera: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
});

class Camera extends React.Component {
  state = {
    camera: undefined
  };

  handleShowCamera = (name, still_url, url) => this.setState({
    camera: { name, still_url, url }
  });

  handleCameraClose = () => this.setState({ camera: undefined });

  render() {
    const { classes, config, card } = this.props;
    const { camera } = this.state;
    const { name, url } = card;
    const still_url = `${card.still_url}?${moment().format('HHmm')}`;
    const cardElevation = getCardElevation(config);
    const squareCards = getSquareCards(config);
    return (
      <Grid className={classes.cameraContainer} item>
        <ButtonBase className={classes.cardOuter} focusRipple
          onClick={() => this.handleShowCamera(name, still_url, url)}>
          <Card className={classes.card} elevation={cardElevation} square={squareCards}>
            <img
              className={classes.camera}
              src={still_url}
              alt={name} />
          </Card>
        </ButtonBase>
        {camera &&
          <CameraDialog
            data={camera}
            handleClose={this.handleCameraClose} />
        }
      </Grid>
    );
  }
}

Camera.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  card: PropTypes.object.isRequired,
};

export default withStyles(styles)(Camera);
