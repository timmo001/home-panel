import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import request from 'superagent';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Logo from '../resources/logo.svg';

const styles = theme => ({
  grid: {
    position: 'fixed',
    height: '100%',
  },
  media: {
    backgroundSize: 'contain',
    height: 140,
    [theme.breakpoints.up('md')]: {
      height: 240,
    },
  },
  fill: {
    flexGrow: 1,
  },
  margin: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    flexBasis: '50%',
  },
  fakeButton: {
    width: 256,
  },
  card: {
    overflowY: 'auto',
  },
  cardContent: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: 0,
  },
});

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    hass_host: '',
    hass_password: '',
    hass_ssl: true,
    showPassword: false,
    showHASSPassword: false,
    createAccount: false,
  };

  componentWillMount = () => {
    const username = localStorage.getItem('username');
    const password = sessionStorage.getItem('password');

    this.setState({
      username: username ? username : '',
      password: password ? password : '',
      createAccount: username ? false : true
    }, () => {
      if (username && password && !this.state.createAccount) this.handleLogIn();
    });
  };

  toggleCreateAccount = () => this.setState({ createAccount: !this.state.createAccount });

  handleChange = prop => event => this.setState({ [prop]: event.target.value });

  handleCheckedChange = name => event => this.setState({ [name]: event.target.checked });

  handleMouseDownPassword = event => event.preventDefault();

  handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword });

  handleClickShowHASSPassword = () => this.setState({ showHASSPassword: !this.state.showHASSPassword });

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleLogIn();
    }
  };

  handleCreateAccount = () => {
    if (this.state.username) {
      console.log('Create account');

      request
        .post(`${process.env.REACT_APP_API_URL}/login/setup`)
        .send({
          username: this.state.username,
          password: this.state.password,
          hass_host: this.state.hass_host,
          hass_password: this.state.hass_password,
          hass_ssl: this.state.hass_ssl,
        })
        .set('Accept', 'application/json')
        .then(res => {
          if (res.status === 200) {
            localStorage.setItem('username', this.state.username);
            sessionStorage.setItem('password', this.state.password);
            this.props.loggedIn(res.body);
          } else {
            console.error(`Error ${res.status}: ${res.body}`);
            this.setState({ error: `Error ${res.status}: ${res.body}` }, () =>
              setTimeout(() => this.setState({ error: undefined }), 8000));
          }
        })
        .catch(err => {
          console.error(String(err));
          this.setState({ error: String(err) + '. Check your credentials and try again.' }, () =>
            setTimeout(() => this.setState({ error: undefined }), 8000));
        });
    }
  };

  handleLogIn = () => {
    if (this.state.username) {
      console.log('Log In');
      request
        .post(`${process.env.REACT_APP_API_URL}/login`)
        .send({
          username: this.state.username,
          password: this.state.password,
        })
        .set('Accept', 'application/json')
        .then(res => {
          if (res.status === 200) {
            localStorage.setItem('username', this.state.username);
            sessionStorage.setItem('password', this.state.password);
            this.props.loggedIn(res.body);
          } else {
            console.error(`Error ${res.status}: ${res.body}`);
            this.setState({ error: `Error ${res.status}: ${res.body}\nCheck your credentials and try again` }, () =>
              setTimeout(() => this.setState({ error: undefined }), 8000));
          }
        })
        .catch(err => {
          console.error(String(err));
          this.setState({ error: String(err) + '. Check your credentials and try again.' }, () =>
            setTimeout(() => this.setState({ error: undefined }), 8000));
        });
    }
  };

  render() {
    const { classes } = this.props;
    const { username, password, hass_host, hass_password, hass_ssl,
      showPassword, showHASSPassword, createAccount, error } = this.state;

    return (
      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center">
        <Grid item lg={4} md={8} sm={8} xs={12}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <CardMedia
                className={classes.media}
                image={Logo}
                title="Home Panel" />
            </CardContent>
            <CardContent className={classes.cardContent} align="center">
              <Typography variant="headline" component="h2">
                {createAccount ? 'Welcome!' : 'Login'}
              </Typography>
              <FormControl className={classNames(classes.margin, classes.textField, classes.fakeButton)}>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  required
                  id="username"
                  type="text"
                  value={username}
                  onChange={this.handleChange('username')}
                  onKeyPress={this.handleKeyPress} />
              </FormControl>
              <FormControl className={classNames(classes.margin, classes.textField)}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  required
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={this.handleChange('password')}
                  onKeyPress={this.handleKeyPress}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  } />
              </FormControl>
              {createAccount &&
                <div>
                  <FormControl className={classNames(classes.margin, classes.textField, classes.fakeButton)}>
                    <InputLabel htmlFor="hass_host">Home Assistant Host</InputLabel>
                    <Input
                      required
                      id="hass_host"
                      type="text"
                      value={hass_host}
                      onChange={this.handleChange('hass_host')}
                      onKeyPress={this.handleKeyPress} />
                  </FormControl>
                  <FormControl className={classNames(classes.margin, classes.textField)}>
                    <InputLabel htmlFor="hass_password">Home Assistant Password</InputLabel>
                    <Input
                      required
                      id="hass_password"
                      type={showHASSPassword ? 'text' : 'password'}
                      value={hass_password}
                      onChange={this.handleChange('hass_password')}
                      onKeyPress={this.handleKeyPress}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle hass password visibility"
                            onClick={this.handleClickShowHASSPassword}
                            onMouseDown={this.handleMouseDownPassword}>
                            {showHASSPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      } />
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hass_ssl}
                        onChange={this.handleCheckedChange('hass_ssl')}
                        value="hass_ssl"
                        color="primary"
                      />
                    }
                    label="Home Assistant SSL"
                  />
                </div>
              }
              {error &&
                <Typography color="error">
                  {error}
                </Typography>
              }
            </CardContent>
            {createAccount ?
              <CardActions>
                <div className={classes.fill} />
                <Button onClick={this.toggleCreateAccount}>Already have an account?</Button>
                <Button onClick={this.handleCreateAccount}>Create Account</Button>
              </CardActions>
              :
              <CardActions>
                <div className={classes.fill} />
                <Button onClick={this.toggleCreateAccount}>Create New Account</Button>
                <Button onClick={this.handleLogIn}>Log In</Button>
              </CardActions>
            }
          </Card>
        </Grid>
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  loggedIn: PropTypes.func.isRequired,
};

export default withStyles(styles)(Login);
