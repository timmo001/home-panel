import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  camera: {
    position: 'relative',
    width: '100%',
    height: '100%',
    paddingBottom: '56.25%', // 16:9
  },
  cameraContent: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  }
});

class Camera extends React.Component {

  render() {
    const { classes, handleClose } = this.props;
    const { data } = this.props.data;
    return (
      <Dialog
        open
        fullScreen
        onClose={handleClose}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="inherit"
              onClick={handleClose}
              aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {data.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.camera}>
          <iframe className={classes.cameraContent} title={data.title} src={data.url} scrolling="no" frameBorder="0" />
        </div>
      </Dialog>
    );
  }
}

Camera.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(Camera);
