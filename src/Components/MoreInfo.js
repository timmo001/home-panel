import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slider from '@material-ui/lab/Slider';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { SwatchesPicker } from 'react-color';

const styles = theme => ({
  button: {
    position: 'absolute',
    right: theme.spacing.unit * 1.5,
    top: theme.spacing.unit * 1.5,
  },
  formControl: {
    display: 'flex',
    margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
    minWidth: 120,
  },
  swatches: {
    '&div': {
      background: 'transparent !imporatant',
      boxShadow: 'none !imporatant',
    },
  },
});

// eslint-disable-next-line
String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

class MoreInfo extends React.Component {
  state = {
    open: true,
    effect: '',
  };

  componentWillReceiveProps = (props) => {
    if (!this.state.defined) {
      const attributes = props.data.attributes;
      if (attributes)
        this.setState({
          brightness: attributes.brightness ? attributes.brightness : undefined,
          color_temp: attributes.color_temp ? attributes.color_temp : undefined,
          effect: attributes.effect ? attributes.effect : '',
          defined: true
        });
    }
  };

  handleClose = () => {
    this.setState({ open: false }, () => {
      this.props.handleClose();
    });
  };

  render() {
    const { open, brightness, color_temp, effect } = this.state;
    const { classes, data, handleChange } = this.props;
    const { entity_id, attributes } = data;
    const domain = entity_id.substring(0, entity_id.indexOf('.'));

    return (
      <Dialog
        open={open}
        onClose={() => this.handleClose}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          {attributes.friendly_name}
          <IconButton
            className={classes.button}
            aria-label="Close"
            onClick={() => this.handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {brightness &&
            <FormControl className={classes.formControl}>
              <Typography id="brightness">Brightness</Typography>
              <Slider
                value={Number(brightness)}
                aria-labelledby="brightness"
                min={1}
                max={255}
                step={1}
                onChange={(e, value) => {
                  this.setState({ brightness: value });
                }}
                onDragEnd={() => {
                  handleChange(domain, true, {
                    entity_id,
                    brightness
                  });
                }} />
            </FormControl>
          }
          {color_temp &&
            <FormControl className={classes.formControl}>
              <Typography id="color_temp">Color Temperature</Typography>
              <Slider
                value={Number(color_temp)}
                aria-labelledby="color_temp"
                min={attributes.min_mireds}
                max={attributes.max_mireds}
                step={1}
                onChange={(e, value) => {
                  this.setState({ color_temp: value });
                }}
                onDragEnd={() => {
                  handleChange(domain, true, {
                    entity_id,
                    color_temp
                  });
                }} />
            </FormControl>
          }
          {attributes.effect_list &&
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="effect">Effect</InputLabel>
              <Select
                value={effect}
                onChange={e => {
                  this.setState({ effect: e.target.value });
                  handleChange(domain, true, {
                    entity_id,
                    effect: e.target.value
                  });
                }}
                inputProps={{
                  name: 'effect',
                  id: 'effect',
                }}>
                {attributes.effect_list.map((effect, id) => {
                  return (
                    <MenuItem key={id} value={effect}>{effect}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          }
          {attributes.rgb_color &&
            <FormControl className={classes.formControl}>
              <SwatchesPicker
                className={classes.swatches}
                onChangeComplete={(color) => handleChange(domain, true, {
                  entity_id,
                  rgb_color: [color.rgb.r, color.rgb.g, color.rgb.b]
                })} />
            </FormControl>
          }
        </DialogContent>
      </Dialog >
    );
  }
}

MoreInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(MoreInfo);
