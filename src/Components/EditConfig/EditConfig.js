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
    overflowY: 'auto'
  },
  navigation: {
    position: 'fixed',
    width: 240,
  },
  main: {
    marginLeft: 240,
  },
  heading: {
    padding: '8px 0 2px 0'
  }
});

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

  handleChange = prop => event => { }//this.setState({ [prop]: event.target.value });

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

  handleListItemClick = (event, item) => this.setState({ selected: item });

  render() {
    const { classes, open, handleClose } = this.props;
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
                  return <ListItem key={x} button onClick={event => this.handleListItemClick(event, i)}>
                    <ListItemText primary={i.name} />
                  </ListItem>
                })}
              </List>
              <div className={classes.main}>
                <Typography variant="headline" className={classes.heading}>{selected.name}</Typography>
                <Divider />
                {selected.id === 0 ?
                  <Item defaultItem={defaultConfig.theme} item={config.theme} handleChange={this.handleChange} />
                  : selected.id === 1 ?
                    <Item defaultItem={defaultConfig.header} item={config.header} handleChange={this.handleChange} />
                    : selected.id === 2 ?
                      <Item defaultItem={defaultConfig.pages} item={config.pages} handleChange={this.handleChange} />
                      : selected.id === 3 &&
                      <Item defaultItem={defaultConfig.items} item={config.items} handleChange={this.handleChange} />
                }
              </div>
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
