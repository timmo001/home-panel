import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import isObject from '../Common/isObject';
import properCase from '../Common/properCase';
import defaultConfig from './defaultConfig.json';
import Item from './Item';

class EditConfig extends React.Component {
  state = {
    config: this.props.config,
  };

  handleChange = prop => event => {}//this.setState({ [prop]: event.target.value });

  handleSave = () => {
    request
      .post(`${this.props.apiUrl}/config/set`)
      .send({
        username: this.props.username,
        password: this.props.password,
        config: this.state.config
      })
      .retry(2)
      .timeout({
        response: 5000,
        deadline: 30000,
      })
      .then(res => {
        if (res.status === 200) {
          window.location.reload(true);
        } else {
        }
      })
      .catch(err => {
      });
  };

  render() {
    const { fullScreen, open, handleClose } = this.props;
    const { config } = this.state;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="lg"
        aria-labelledby="confirmation-dialog-title">
        <DialogTitle id="confirmation-dialog-title">Edit Config</DialogTitle>
        <DialogContent>
          <Typography variant="subheading" style={{ padding: '8px 0 2px 0' }}>Theme</Typography>
          <Divider />
          {Object.keys(defaultConfig.theme).map((i, x) => {
            return <Item key={x} objKey={i} item={defaultConfig.theme[i]} handleChange={this.handleChange} />
            // return (
            //   <div key={x}>
            //     <Typography style={{ padding: '8px 0 2px 16px' }}>{i1 === 'ui' ? 'UI' : properCase(i1)}</Typography>
            //     <Divider style={{ marginLeft: 16 }} />
            //     {Array.isArray(defaultConfig.theme[i1]) ?
            //       config.theme[i1].map((a1, ax) => {
            //         return (
            //           <div key={ax} style={{ padding: '8px 0 2px 16px' }}>
            //             {isObject(a1) ?
            //               Object.keys(a1).map((ai1, aix) => {
            //                 return <Item key={aix} objKey={ai1} item={a1[ai1]} handleChange={this.handleChange} />
            //               })
            //               :
            //               <div>{a1}</div>
            //             }
            //             <Divider style={{ marginTop: 16, marginLeft: 16 }} />
            //           </div>
            //         );
            //       })
            //       :
            //       <div key={x}>
            //         {/* {Object.keys(defaultConfig.theme[i1]).map((i2, y) => {
            //           return (
            //             <div key={y} style={{ padding: '8px 0 2px 24px' }}>
            //               {isObject(defaultConfig.theme[i1][i2]) ?
            //                 <div>
            //                   <Typography>{properCase(i2)}</Typography>
            //                   {Object.keys(defaultConfig.theme[i1][i2]).map((i3, z) => {
            //                     return (
            //                       <div key={z} style={{ padding: '8px 0 2px 16px' }}>
            //                         {isObject(defaultConfig.theme[i1][i2][i3]) ?
            //                           <div></div>
            //                           :
            //                           <Input key={z} name={i3} value={config.theme[i1][i2][i3]} handleChange={this.handleChange} />
            //                         }
            //                       </div>
            //                     );
            //                   })}
            //                 </div>
            //                 :
            //                 <Input name={i2} value={config.theme[i1][i2]} handleChange={this.handleChange} />
            //               }
            //             </div>
            //           );
            //         })} */}
            //       </div>
            //     }
            //   </div>
            // );
          })}
          <Typography variant="subheading" style={{ padding: '8px 0 2px 0' }}>Header</Typography>
          <Divider />
          <Typography variant="subheading" style={{ padding: '8px 0 2px 0' }}>Pages</Typography>
          <Divider />
          <Typography variant="subheading" style={{ padding: '8px 0 2px 0' }}>Items (Groups)</Typography>
          <Divider />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditConfig.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
  apiUrl: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withMobileDialog()(EditConfig);