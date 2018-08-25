import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import request from 'superagent';
import { withStyles } from '@material-ui/core/styles';
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
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

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    api_url: '',
    hass_host: '',
    hass_password: '',
    hass_ssl: true,
    showPassword: false,
    showHASSPassword: false,
    createAccount: false,
    loading: false,
    success: false,
  };

  componentWillMount = () => {
    const api_url = localStorage.getItem('api_url');
    const username = localStorage.getItem('username');
    const password = sessionStorage.getItem('password');

    this.setState({
      username: username ? username : '',
      password: password ? password : '',
      api_url: api_url ? api_url : '',
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
    this.setState({ success: false, loading: true, }, () => {
      if (this.state.username) {
        console.log('Create account');

        request
          .post(`${this.state.api_url}/login/setup`)
          .send({
            username: this.state.username,
            password: this.state.password,
            hass_host: this.state.hass_host,
            hass_password: this.state.hass_password,
            hass_ssl: this.state.hass_ssl,
          })
          .retry(2)
          .timeout({
            response: 10000,
            deadline: 60000,
          })
          .then(res => {
            if (res.status === 200) {
              localStorage.setItem('api_url', this.state.api_url);
              this.props.handleUpdateApiUrl(this.state.api_url);
              localStorage.setItem('username', this.state.username);
              sessionStorage.setItem('password', this.state.password);
              this.setState({ loading: false, success: true }, () => {
                this.props.loggedIn(res.body);
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

  handleLogIn = () => {
    this.setState({ success: false, loading: true, }, () => {
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
            deadline: 60000,
          })
          .then(res => {
            if (res.status === 200) {
              localStorage.setItem('api_url', this.state.api_url);
              this.props.handleUpdateApiUrl(this.state.api_url);
              localStorage.setItem('username', this.state.username);
              sessionStorage.setItem('password', this.state.password);
              this.setState({ loading: false, success: true }, () => {
                this.props.loggedIn(res.body);
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
    const { username, password, api_url, hass_host, hass_password, hass_ssl,
      showPassword, showHASSPassword, createAccount, error, loading, success } = this.state;
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
            <CardContent className={classes.cardContent} align="center">
              <CardMedia
                className={classes.media}
                image={Logo}
                title="Home Panel" />
              <Typography variant="headline" component="h2">
                {createAccount ? 'Welcome!' : 'Login'}
              </Typography>
              <FormControl className={classNames(classes.margin, classes.textField, classes.fakeButton)}>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  required
                  id="username"
                  type="text"
                  inputProps={{
                    autoCapitalize: "none"
                  }}
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
                  inputProps={{
                    autoCapitalize: "none"
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
              <FormControl className={classNames(classes.margin, classes.textField, classes.fakeButton)}>
                <InputLabel htmlFor="api_url">API URL</InputLabel>
                <Input
                  required
                  id="api_url"
                  type="text"
                  inputProps={{
                    autoCapitalize: "none"
                  }}
                  value={api_url}
                  onChange={this.handleChange('api_url')}
                  onKeyPress={this.handleKeyPress} />
              </FormControl>
              {createAccount &&
                <div>
                  <FormControl className={classNames(classes.margin, classes.textField, classes.fakeButton)}>
                    <InputLabel htmlFor="hass_host">Home Assistant Host</InputLabel>
                    <Input
                      required
                      id="hass_host"
                      type="text"
                      inputProps={{
                        autoCapitalize: "none"
                      }}
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
                      inputProps={{
                        autoCapitalize: "none"
                      }}
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
                    className={classes.switch}
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
                <div className={classes.wrapper}>
                  <Button
                    className={buttonClassname}
                    disabled={loading}
                    onClick={this.handleCreateAccount}>
                    Create Account
                  </Button>
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
              </CardActions>
              :
              <CardActions>
                <div className={classes.fill} />
                <Button onClick={this.toggleCreateAccount}>Create New Account</Button>
                <div className={classes.wrapper}>
                  <Button
                    className={buttonClassname}
                    disabled={loading}
                    onClick={this.handleLogIn}>
                    Log In
                  </Button>
                  {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
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
  handleUpdateApiUrl: PropTypes.func.isRequired,
};

export default withStyles(styles)(Login);
