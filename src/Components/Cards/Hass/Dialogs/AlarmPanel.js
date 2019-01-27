import React from 'react';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

class AlarmPanel extends React.PureComponent {
  state = {
    open: true,
    code: '',
    showCode: false,
  };

  handleClose = () => {
    this.setState({ open: false }, () => {
      this.props.handleClose();
    });
  };

  handleMouseDownCode = event => event.preventDefault();
  handleClickShowCode = () => this.setState({ showCode: !this.state.showCode });

  handleChange = prop => event => this.setState({ [prop]: event.target.value });

  handleClick = (value) => {
    this.setState({ code: this.state.code ? this.state.code + value : value });
  };
  handleClear = () => this.setState({ code: '' });

  render() {
    const { open, showCode, code } = this.state;
    const { fullScreen, entity, handleChange } = this.props;
    const { entity_id, attributes, state } = entity;

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
              top: 12,
            }}
            aria-label="Close"
            onClick={() => this.handleClose()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" align="center">
            {state.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
          </Typography>
          <Grid container justify="center">
            <Grid item xs>
              <FormControl style={{ margin: '1.0rem 2.0rem', flexBasis: '50%' }}>
                <InputLabel htmlFor="code" shrink>Code</InputLabel>
                <Input
                  id="code"
                  type={showCode ? 'text' : 'password'}
                  autoComplete="off"
                  value={code}
                  onChange={this.handleChange('code')}
                  onKeyPress={this.handleKeyPress} />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs><Button onClick={() => this.handleClick('1')}>1</Button></Grid>
            <Grid item xs><Button onClick={() => this.handleClick('2')}>2</Button></Grid>
            <Grid item xs><Button onClick={() => this.handleClick('3')}>3</Button></Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs><Button onClick={() => this.handleClick('4')}>4</Button></Grid>
            <Grid item xs><Button onClick={() => this.handleClick('5')}>5</Button></Grid>
            <Grid item xs><Button onClick={() => this.handleClick('6')}>6</Button></Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs><Button onClick={() => this.handleClick('7')}>7</Button></Grid>
            <Grid item xs><Button onClick={() => this.handleClick('8')}>8</Button></Grid>
            <Grid item xs><Button onClick={() => this.handleClick('9')}>9</Button></Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs></Grid>
            <Grid item xs><Button onClick={() => this.handleClick('0')}>0</Button></Grid>
            <Grid item xs><Button onClick={() => this.handleClear()}>Clear</Button></Grid>
          </Grid>
          {state.startsWith('armed') ?
            <Grid container justify="center">
              <Grid item>
                <Button onClick={() => {
                  handleChange('alarm_control_panel', 'alarm_disarm', { entity_id, code });
                  this.handleClose();
                }}>Disarm</Button>
              </Grid>
            </Grid>
            :
            <Grid container justify="center">
              <Grid item>
                <Button onClick={() => {
                  handleChange('alarm_control_panel', 'alarm_arm_home', { entity_id, code });
                  this.handleClose();
                }}>Arm Home</Button>
              </Grid>
              <Grid item>
                <Button onClick={() => {
                  handleChange('alarm_control_panel', 'alarm_arm_away', { entity_id, code });
                  this.handleClose();
                }}>Arm Away</Button>
              </Grid>
            </Grid>
          }
        </DialogContent>
      </Dialog>
    );
  }
}

AlarmPanel.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  entity: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withMobileDialog()(AlarmPanel);
