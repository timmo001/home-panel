import React from 'react';
import request from 'superagent';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import defaultConfig from './defaultConfig.json';
import Item from './Item';

const styles = theme => ({
  dialog: {
    background: theme.palette.backgrounds.default
  },
  dialogContent: {
    paddingLeft: 0
  },
  navigation: {
    position: 'fixed',
    width: 240
  },
  navigationDivider: {
    position: 'absolute',
    width: 1,
    height: 'calc(100% - 68px)',
    marginLeft: -12
  },
  main: {
    marginLeft: 256,
    overflowY: 'auto'
  },
  heading: {
    padding: '8px 0 2px 0'
  }
});

Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}

class EditConfig extends React.Component {
  state = {
    config: this.props.config,
    topLevel: [
      { id: 0, name: 'Theme' },
      { id: 1, name: 'Header' },
      { id: 2, name: 'Pages' },
      { id: 3, name: 'Items (Groups)' }
    ],
    selected: { id: 0, name: 'Theme' }
  };

  handleConfigChange = (path, value) => {
    let config = this.state.config;
    // Set the new value
    let last = path.pop();
    path.reduce((o, k) => o[k] = o[k] || {}, config)[last] = value;
    this.setState({ config });
  };

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
          console.log('An error occurred: ', res.status);
        }
      })
      .catch(err => {
        console.log('An error occurred: ', err);
      });
  };

  handleListItemClick = (event, item) => this.setState({ selected: item });

  handleClose = () => this.setState({ config: this.props.config }, () => this.props.handleClose());

  render() {
    const { classes, open } = this.props;
    const { config, topLevel, selected } = this.state;

    return (
      <div>
        {config &&
          <Dialog
            fullScreen
            open={open}
            className={classes.dialog}
            disableBackdropClick
            disableEscapeKeyDown
            aria-labelledby="confirmation-dialog-title">
            <DialogTitle id="confirmation-dialog-title">Edit Config</DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <List component="nav" className={classes.navigation}>
                {topLevel.map((i, x) => {
                  return <ListItem
                    key={x}
                    button
                    onClick={event => this.handleListItemClick(event, i)}
                    selected={selected.id === i.id}>
                    <ListItemText primary={i.name} />
                  </ListItem>
                })}
              </List>
              <div className={classes.main}>
                <Divider className={classes.navigationDivider} />
                <Typography variant="headline" className={classes.heading}>{selected.name}</Typography>
                <Divider />
                {selected.id === 0 ?
                  <Item defaultItem={defaultConfig.theme} item={config.theme} itemPath={['theme']} handleConfigChange={this.handleConfigChange} />
                  : selected.id === 1 ?
                    <Item defaultItem={defaultConfig.header} item={config.header} itemPath={['header']} handleConfigChange={this.handleConfigChange} />
                    : selected.id === 2 ?
                      <Item defaultItem={defaultConfig.pages} item={config.pages} itemPath={['pages']} handleConfigChange={this.handleConfigChange} />
                      : selected.id === 3 &&
                      <Item defaultItem={defaultConfig.items} item={config.items} itemPath={['items']} handleConfigChange={this.handleConfigChange} />
                }
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        }
      </div>
    );
  }
}

EditConfig.propTypes = {
  open: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
  apiUrl: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(EditConfig);
