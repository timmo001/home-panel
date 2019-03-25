import React from 'react';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/withMobileDialog';
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
import { CirclePicker } from 'react-color';

// const styles = theme => ({
//   button: {
//   },
//   formControl: {
//     display: 'flex',
//                   margin: `16px 8px`,
//     minWidth: 120,
//   },
//   picker: {
//
//   }
// });

class MoreInfo extends React.PureComponent {
  state = {
    open: true,
    effect: ''
  };

  componentDidMount = () => this.updateProps();

  componentDidUpdate = prevProps =>
    this.props.data.attributes !== prevProps.data.attributes &&
    this.updateProps();

  updateProps = () => {
    if (!this.state.defined) {
      const attributes = this.props.data.attributes;
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
    const { fullScreen, data, handleChange } = this.props;
    const { entity_id, attributes } = data;
    const domain = entity_id.substring(0, entity_id.indexOf('.'));

    return (
      <Dialog
        open={open}
        fullScreen={fullScreen}
        onClose={() => this.handleClose()}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          {attributes.friendly_name}
          <IconButton
            style={{
              position: 'absolute',
              right: 12,
              top: 12
            }}
            aria-label="Close"
            onClick={() => this.handleClose()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {brightness && (
            <FormControl
              style={{
                display: 'flex',
                margin: `16px 8px`,
                minWidth: 120
              }}>
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
                }}
              />
            </FormControl>
          )}
          {color_temp && (
            <FormControl
              style={{
                display: 'flex',
                margin: `16px 8px`,
                minWidth: 120
              }}>
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
                }}
              />
            </FormControl>
          )}
          {attributes.effect_list && (
            <FormControl
              style={{
                display: 'flex',
                margin: `16px 8px`,
                minWidth: 120
              }}>
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
                  id: 'effect'
                }}>
                {attributes.effect_list.map((effect, id) => {
                  return (
                    <MenuItem key={id} value={effect}>
                      {effect}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
          {attributes.rgb_color && (
            <FormControl
              style={{
                display: 'flex',
                margin: `16px 8px`,
                minWidth: 120
              }}>
              <CirclePicker
                style={{ marginTop: 16 }}
                circleSize={36}
                onChangeComplete={color =>
                  handleChange(domain, true, {
                    entity_id,
                    rgb_color: [color.rgb.r, color.rgb.g, color.rgb.b]
                  })
                }
              />
            </FormControl>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

MoreInfo.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default withMobileDialog()(MoreInfo);
