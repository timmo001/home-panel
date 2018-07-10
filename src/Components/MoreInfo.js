import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import config from '../config.json';

const styles = theme => ({
});

// eslint-disable-next-line
String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

class MoreInfo extends React.Component {

  render() {
    const { classes, theme, data, handleChange } = this.props;
    const { entity_id, state, attributes } = data.entity;
    const domain = entity_id.substring(0, entity_id.indexOf('.'));

    console.log('data', data);

    return (
      <Dialog
        open={data.open}
        onClose={() => data.open = false}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{attributes.friendly_name}</DialogTitle>
        <DialogContent>
          {attributes.brightness &&
            <div>
              {Number(attributes.brightness)}
            </div>
          }
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    );
  }
}

MoreInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(MoreInfo);
