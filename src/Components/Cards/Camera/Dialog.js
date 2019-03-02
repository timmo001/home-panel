import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";

const styles = () => ({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  camera: {
    position: "relative",
    width: "100%",
    height: "100%",
    paddingBottom: "56.25%" // 16:9
  },
  cameraContent: {
    position: "absolute",
    height: "100%",
    width: "100%",
    cursor: "pointer"
  },
  cameraOverlay: {
    position: "fixed",
    height: "100%",
    width: "100%"
  }
});

class Camera extends React.PureComponent {
  render() {
    const { classes, data, handleClose } = this.props;
    return (
      <Dialog open fullScreen>
        <div className={classes.camera}>
          <img
            className={classes.cameraContent}
            onClick={() => handleClose()}
            src={data.url}
            alt={data.title}
          />
        </div>
      </Dialog>
    );
  }
}

Camera.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default withStyles(styles)(Camera);
