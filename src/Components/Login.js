import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
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
      height: 240
    }
  },
  fill: {
    flexGrow: 1
  },
  margin: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 2
  },
  textField: {
    flexBasis: '50%'
  },
  fakeButton: {
    width: 256
  },
  cardContent: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: 0
  },
  switch: {
    width: 256,
    justifyContent: 'center',
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
});

class Login extends React.PureComponent {
  state = {
    username: '',
    password: '',
    hass_url: '',
    showPassword: false,
    createAccount: false,
    loading: false,
    success: false
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
      : `${window.location.protocol}//${window.location.hostname}:3234`;
    const hass_url = process.env.REACT_APP_OVERRIDE_HASS_URL
      ? process.env.REACT_APP_OVERRIDE_HASS_URL
      : localStorage.getItem('hass_url') ||
        `${window.location.protocol}//hassio:8123`;

    localStorage.setItem('should_auth', true);

    this.setState(
      {
        username: username ? username : '',
        password: password ? password : '',
        api_url: api_url,
        hass_url: hass_url ? hass_url : '',
        createAccount: localStorage.getItem('been_here') ? false : true
      },
      () => {
        localStorage.setItem('been_here', true);
        this.handleValidation();
      }
    );
  };

  toggleCreateAccount = () =>
    this.setState({ createAccount: !this.state.createAccount });

  handleValidation = () => {
    if (!this.state.username) {
      this.setState({ invalid: 'No username!' });
      return;
    }
    if (!this.state.password) {
      this.setState({ invalid: 'No password!' });
      return;
    }
    if (this.state.hass_url) {
      if (
        !this.state.hass_url.startsWith('http') ||
        !this.state.hass_url.includes('://')
      ) {
        this.setState({ invalid: 'Home Assistant URL invalid!' });
        return;
      }
      if (window.location.protocol === 'https:') {
        if (this.state.hass_url.startsWith('http:')) {
          this.setState({ invalid: 'Your HASS instance must use SSL/https.' });
          return;
        }
      }
    }
    this.setState({ invalid: undefined });
  };

  handleChange = prop => event =>
    this.setState({ [prop]: event.target.value }, () =>
      this.handleValidation()
    );

  handleCheckedChange = name => event =>
    this.setState({ [name]: event.target.checked });

  handleMouseDownPassword = event => event.preventDefault();

  handleClickShowPassword = () =>
    this.setState({ showPassword: !this.state.showPassword });

  handleKeyPress = e => {
    if (e.key === 'Enter' && !this.state.invalid) {
      this.state.createAccount
        ? this.handleCreateAccount()
        : this.handleLogin();
    }
  };

  handleCreateAccount = () => {
    localStorage.setItem('hass_url', this.state.hass_url);
    this.props.setHassUrl(this.state.hass_url);
    this.props.handleCreateAccount({
      username: this.state.username,
      password: this.state.password
    });
  };

  handleLogin = () => {
    localStorage.setItem('hass_url', this.state.hass_url);
    this.props.setHassUrl(this.state.hass_url);
    this.props.handleLogin({
      strategy: 'local',
      username: this.state.username,
      password: this.state.password
    });
  };

  render() {
    const { classes } = this.props;
    const {
      username,
      password,
      hass_url,
      showPassword,
      createAccount,
      error,
      loading,
      success,
      invalid
    } = this.state;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success
    });

    return (
      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center">
        <Grid item lg={4} md={8} sm={8} xs={12}>
          <Card className={classes.card}>
            <CardContent
              className={classes.cardContent}
              align="center"
              component="form">
              <CardMedia
                className={classes.media}
                image={Logo}
                title="Home Panel"
              />
              <Typography variant="h5" component="h2">
                {createAccount ? 'Welcome!' : 'Login'}
              </Typography>
              {!process.env.REACT_APP_OVERRIDE_USERNAME && (
                <FormControl
                  className={classNames(
                    classes.margin,
                    classes.textField,
                    classes.fakeButton
                  )}>
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
                    onKeyPress={this.handleKeyPress}
                  />
                </FormControl>
              )}
              {!process.env.REACT_APP_OVERRIDE_PASSWORD && (
                <FormControl
                  className={classNames(classes.margin, classes.textField)}>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    required
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    inputProps={{
                      autoCapitalize: 'none',
                      autoComplete: createAccount
                        ? 'new-password'
                        : 'current-password'
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
                    }
                  />
                </FormControl>
              )}
              {!process.env.REACT_APP_OVERRIDE_HASS_URL && (
                <FormControl
                  className={classNames(
                    classes.margin,
                    classes.textField,
                    classes.fakeButton
                  )}>
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
                    onKeyPress={this.handleKeyPress}
                  />
                </FormControl>
              )}
              {error && <Typography color="error">{error}</Typography>}
            </CardContent>
            <CardActions>
              <div className={classes.fill} />
              {invalid && (
                <Typography color="error" variant="subtitle1">
                  {invalid}
                </Typography>
              )}
              {!process.env.REACT_APP_OVERRIDE_API_URL && (
                <Button onClick={this.toggleCreateAccount}>
                  {createAccount
                    ? 'Already have an account?'
                    : 'Create New Account'}
                </Button>
              )}
              <div className={classes.wrapper}>
                {createAccount && !process.env.REACT_APP_OVERRIDE_API_URL ? (
                  <Button
                    className={buttonClassname}
                    disabled={loading}
                    onClick={this.handleCreateAccount}>
                    Sign Up
                  </Button>
                ) : (
                  <Button
                    className={buttonClassname}
                    disabled={loading || invalid ? true : false}
                    onClick={this.handleLogin}>
                    Log In
                  </Button>
                )}
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  setHassUrl: PropTypes.func.isRequired,
  handleCreateAccount: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired
};

export default withStyles(styles)(Login);
