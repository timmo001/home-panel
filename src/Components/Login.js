import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import request from 'superagent';
import withStyles from '@material-ui/core/styles/withStyles';
import green from '@material-ui/core/colors/green';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Logo from '../resources/logo.svg';

const styles = theme => ({
  grid: {
    height: '100%',
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    overflow: 'auto'
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
  cardContent: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: 0,
  },
  switch: {
    width: 256,
    justifyContent: 'center',
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class Login extends React.PureComponent {
  state = {
    username: '',
    password: '',
    api_url: '',
    hass_url: '',
    showPassword: false,
    createAccount: false,
    loading: false,
    success: false,
  };

  componentDidMount = () => {
    const username = process.env.REACT_APP_OVERRIDE_USERNAME
      ? process.env.REACT_APP_OVERRIDE_USERNAME
      : localStorage.getItem('username');
    const password = process.env.REACT_APP_OVERRIDE_PASSWORD
      ? process.env.REACT_APP_OVERRIDE_PASSWORD
      : sessionStorage.getItem('password');
    const api_url = process.env.REACT_APP_OVERRIDE_API_URL
      ? process.env.REACT_APP_OVERRIDE_API_URL
      : localStorage.getItem('api_url');
    const hass_url = process.env.REACT_APP_OVERRIDE_HASS_URL
      ? process.env.REACT_APP_OVERRIDE_HASS_URL
      : localStorage.getItem('hass_url');

    localStorage.setItem('should_auth', true);

    this.setState({
      username: username ? username : '',
      password: password ? password : '',
      api_url: api_url ? api_url : `${window.location.protocol}//${window.location.hostname}:3234`,
      hass_url: hass_url ? hass_url : '',
      createAccount: localStorage.getItem('been_here') ? false : true
    }, () => {
      localStorage.setItem('been_here', true);
      this.handleValidation(invalid => {
        !invalid && localStorage.getItem('should_login') && !this.state.createAccount && this.handleLogIn();
      });
    });
  };

  toggleCreateAccount = () => this.setState({ createAccount: !this.state.createAccount });

  handleValidation = cb => {
    if (!this.state.username) { this.setState({ invalid: 'No username!' }); cb(this.state.invalid); return; }
    if (!this.state.password) { this.setState({ invalid: 'No password!' }); cb(this.state.invalid); return; }
    if (!this.state.api_url || !this.state.api_url.startsWith('http') || !this.state.api_url.includes('://')) {
      this.setState({ invalid: 'API URL invalid!' }); cb(this.state.invalid); return;
    }
    if (this.state.hass_url) {
      if (!this.state.hass_url.startsWith('http') || !this.state.hass_url.includes('://')) {
        this.setState({ invalid: 'Home Assistant URL invalid!' }); cb(this.state.invalid); return;
      }
      if (window.location.protocol === 'https:') {
        if (this.state.api_url.startsWith('http:')) {
          this.setState({ invalid: 'The API must use SSL/https.' }); cb(this.state.invalid); return;
        }
        if (this.state.hass_url.startsWith('http:')) {
          this.setState({ invalid: 'Your HASS instance must use SSL/https.' }); cb(this.state.invalid); return;
        }
      }
    }
    this.setState({ invalid: undefined }, () => cb(undefined));
  };

  handleChange = prop => event => this.setState({ [prop]: event.target.value }, () => this.handleValidation(() => { }));

  handleCheckedChange = name => event => this.setState({ [name]: event.target.checked });

  handleMouseDownPassword = event => event.preventDefault();

  handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword });

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && !this.state.invalid) {
      this.state.createAccount ? this.handleCreateAccount() : this.handleLogIn();
    }
  };

  handleCreateAccount = () => {
    var api_url = this.state.api_url;
    api_url = api_url.endsWith('/') ? api_url.substring(0, api_url.length - 1) : this.state.api_url;
    this.setState({ api_url, success: false, loading: true, }, () => {
      if (this.state.username) {
        console.log('Create account');
        request
          .post(`${this.state.api_url}/login/setup`)
          .send({
            username: this.state.username,
            password: this.state.password,
          })
          .retry(2)
          .timeout({
            response: 10000,
            deadline: 80000,
          })
          .then(res => {
            if (res.status === 200) {
              localStorage.setItem('username', this.state.username);
              sessionStorage.setItem('password', this.state.password);
              localStorage.setItem('api_url', this.state.api_url);
              localStorage.setItem('hass_url', this.state.hass_url);
              this.setState({ loading: false, success: true }, () => {
                this.props.loggedIn(res.body, this.state.username, this.state.password, this.state.api_url, this.state.hass_url);
              });
            } else {
              this.setState({ loading: false, success: false }, () => {
                console.error(`Error ${res.status}: ${res.body}`);
                this.setState({ failed: true, error: `Error ${res.status}: ${res.body}\nCheck your credentials and try again` }, () =>
                  setTimeout(() => this.setState({ error: undefined }), 20000));
              });
            }
          })
          .catch(err => {
            this.setState({ loading: false, success: false }, () => {
              if (err.response) {
                console.error(`Error: ${err.status} - ${err.response.text}`);
                this.setState({ error: `Error: ${err.status} - ${err.response.text}` }, () =>
                  setTimeout(() => this.setState({ error: undefined }), 8000));
              } else {
                console.error(`Error: ${err.message} - Check your credentials and try again`);
                this.setState({ error: `Error: ${err.message} - Check your credentials and try again` }, () =>
                  setTimeout(() => this.setState({ error: undefined }), 8000));
              }
            });
          });
      }
    });
  };

  handleLogIn = () => {
    var api_url = this.state.api_url;
    api_url = api_url.endsWith('/') ? api_url.substring(0, api_url.length - 1) : this.state.api_url;
    this.setState({ api_url, success: false, loading: true, }, () => {
      if (this.state.username) {
        console.log('Log In');
        request
          .post(`${this.state.api_url}/login`)
          .send({
            username: this.state.username,
            password: this.state.password,
          })
          .retry(2)
          .timeout({
            response: 10000,
            deadline: 40000,
          })
          .then(res => {
            if (res.status === 200) {
              localStorage.setItem('username', this.state.username);
              sessionStorage.setItem('password', this.state.password);
              localStorage.setItem('api_url', this.state.api_url);
              localStorage.setItem('hass_url', this.state.hass_url);
              this.setState({ loading: false, success: true }, () => {
                this.props.loggedIn(res.body, this.state.username, this.state.password, this.state.api_url, this.state.hass_url);
              });
            } else {
              this.setState({ loading: false, success: false }, () => {
                console.error(`Error ${res.status}: ${res.body}`);
                this.setState({ error: `Error ${res.status}: ${res.body}\nCheck your credentials and try again` }, () =>
                  setTimeout(() => this.setState({ error: undefined }), 20000));
              });
            }
          })
          .catch(err => {
            this.setState({ loading: false, success: false }, () => {
              if (err.response) {
                console.error(`Error: ${err.status} - ${err.response.text}`);
                this.setState({ error: `Error: ${err.status} - ${err.response.text}` }, () =>
                  setTimeout(() => this.setState({ error: undefined }), 8000));
              } else {
                console.error(`Error: ${err.message} - Check your credentials and try again`);
                this.setState({ error: `Error: ${err.message} - Check your credentials and try again` }, () =>
                  setTimeout(() => this.setState({ error: undefined }), 8000));
              }
            });
          });
      }
    });
  };

  render() {
    const { classes } = this.props;
    const { username, password, api_url, hass_url, showPassword,
      createAccount, error, loading, success, invalid } = this.state;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });

    return (
      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center">
        <Grid item lg={4} md={8} sm={8} xs={12}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent} align="center" component="form">
              <CardMedia
                className={classes.media}
                image={Logo}
                title="Home Panel" />
              <Typography variant="h5" component="h2">
                {createAccount ? 'Welcome!' : 'Login'}
              </Typography>
              {!process.env.REACT_APP_OVERRIDE_USERNAME &&
                <FormControl className={classNames(classes.margin, classes.textField, classes.fakeButton)}>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input
                    required
                    id="username"
                    type="text"
                    inputProps={{
                      autoCapitalize: 'none',
                      autoComplete: 'username'
                    }}
                    value={username}
                    onChange={this.handleChange('username')}
                    onKeyPress={this.handleKeyPress} />
                </FormControl>
              }
              {!process.env.REACT_APP_OVERRIDE_PASSWORD &&
                <FormControl className={classNames(classes.margin, classes.textField)}>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    required
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    inputProps={{
                      autoCapitalize: 'none',
                      autoComplete: createAccount ? 'new-password' : 'current-password'
                    }}
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
              }
              {!process.env.REACT_APP_OVERRIDE_API_URL &&
                <FormControl className={classNames(classes.margin, classes.textField, classes.fakeButton)}>
                  <InputLabel htmlFor="api_url">API URL</InputLabel>
                  <Input
                    required
                    id="api_url"
                    type="text"
                    inputProps={{
                      autoCapitalize: 'none',
                      autoComplete: 'url'
                    }}
                    value={api_url}
                    onChange={this.handleChange('api_url')}
                    onKeyPress={this.handleKeyPress} />
                </FormControl>
              }
              {!process.env.REACT_APP_OVERRIDE_HASS_URL &&
                <FormControl className={classNames(classes.margin, classes.textField, classes.fakeButton)}>
                  <InputLabel htmlFor="hass_url">Home Assistant URL</InputLabel>
                  <Input
                    required
                    id="hass_url"
                    type="text"
                    inputProps={{
                      autoCapitalize: 'none',
                      autoComplete: 'url'
                    }}
                    value={hass_url}
                    onChange={this.handleChange('hass_url')}
                    onKeyPress={this.handleKeyPress} />
                </FormControl>
              }
              {error &&
                <Typography color="error">
                  {error}
                </Typography>
              }
            </CardContent>
            <CardActions>
              <div className={classes.fill} />
              {invalid &&
                <Typography color="error" variant="subtitle1">
                  {invalid}
                </Typography>
              }
              {!process.env.REACT_APP_OVERRIDE_API_URL &&
                <Button onClick={this.toggleCreateAccount}>
                  {createAccount ? 'Already have an account?' : 'Create New Account'}
                </Button>
              }
              <div className={classes.wrapper}>
                {createAccount && !process.env.REACT_APP_OVERRIDE_API_URL ?
                  <Button
                    className={buttonClassname}
                    disabled={loading}
                    onClick={this.handleCreateAccount}>
                    Sign Up
                  </Button>
                  :
                  <Button
                    className={buttonClassname}
                    disabled={loading || invalid ? true : false}
                    onClick={this.handleLogIn}>
                    Log In
                  </Button>
                }
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
            </CardActions>
          </Card>
        </Grid>
      </Grid >
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  loggedIn: PropTypes.func.isRequired,
};

export default withStyles(styles)(Login);
