import React from 'react';
import PropTypes from 'prop-types';
import ReactAnimatedWeather from 'react-animated-weather';
import Moment from 'react-moment';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RefreshIcon from '@material-ui/icons/Refresh';
import BrushIcon from '@material-ui/icons/Brush';
import RadioIcon from '@material-ui/icons/Radio';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const styles = theme => ({
  header: {
    display: 'block',
    width: '100%',
    height: 180,
    [theme.breakpoints.down('sm')]: {
      height: 120,
    }
  },
  buttons: {
    position: 'fixed',
    top: 0,
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    }
  },
  button: {
    height: 42,
    width: 42,
    marginRight: theme.spacing.unit,
    color: theme.palette.text.light,
    [theme.breakpoints.down('sm')]: {
      height: 32,
      width: 32,
    }
  },
  icon: {
    height: 24,
    width: 24,
    [theme.breakpoints.down('sm')]: {
      height: 18,
      width: 18,
    }
  },
  timeDateContainer: {
    position: 'fixed',
    top: 12,
    left: '50%',
    transform: 'translateX(-50%)',
    [theme.breakpoints.down('sm')]: {
      top: 4,
    }
  },
  time: {
    textAlign: 'center',
    color: theme.palette.text.main,
    fontSize: '6.0rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '4.8rem'
    }
  },
  timePeriod: {
    paddingLeft: theme.spacing.unit,
    fontSize: '3.0rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.2rem'
    }
  },
  date: {
    color: theme.palette.text.main,
    marginTop: theme.spacing.unit * -2.5,
    textAlign: 'center',
    fontSize: '2.4rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem'
    }
  },
  weatherContainer: {
    position: 'fixed',
    maxWidth: 320,
    top: 98,
    left: 0,
    transform: 'translateY(-50%)',
    textAlign: 'start',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 200,
      top: 68,
    },
    [theme.breakpoints.down('xs')]: {
      visibility: 'hidden'
    }
  },
  condition: {
    paddingLeft: theme.spacing.unit * 14,
    color: theme.palette.text.main,
    fontSize: '2.8rem',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing.unit * 9,
      fontSize: '1.8rem'
    }
  },
  weatherIcon: {
    position: 'fixed',
    transform: `translateX(-96px)`,
    [theme.breakpoints.down('sm')]: {
      transform: `translateX(-58px)`,
    },
  },
  data: {
    maxWidth: 320,
    paddingLeft: theme.spacing.unit * 14,
    color: theme.palette.text.main,
    fontSize: '1.8rem',
    '& span': {
      paddingLeft: theme.spacing.unit * 2,
    },
    '& span:first-child': {
      paddingLeft: 0,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: 240,
      paddingLeft: theme.spacing.unit * 9,
      fontSize: '1.4rem'
    }
  },
  indoorContainer: {
    position: 'fixed',
    maxWidth: 320,
    top: 86,
    right: 0,
    transform: 'translateY(-50%)',
    textAlign: 'end',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 240,
      top: 62
    },
    [theme.breakpoints.down('xs')]: {
      visibility: 'hidden'
    }
  },
  indoorInnerContainer: {
    paddingTop: theme.spacing.unit / 2,
    '&:first-child': {
      paddingTop: 0,
    }
  },
  indoorLabel: {
    paddingRight: theme.spacing.unit * 2,
    color: theme.palette.text.main,
    fontSize: '2.2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem'
    },
  },
  indoor: {
    paddingRight: theme.spacing.unit * 2,
    color: theme.palette.text.main,
    fontSize: '1.8rem',
    '& span': {
      paddingLeft: theme.spacing.unit * 2,
    },
    '& span:first-child': {
      paddingLeft: 0,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.4rem'
    },
  },
});

// eslint-disable-next-line
String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

class Header extends React.Component {
  state = {
    anchorEl: null,
  };

  getState = (entities, entity, endAdornment = '') => {
    var state = entities.find(i => {
      return i[1].entity_id === entity;
    });
    if (!state) return undefined;
    state = state[1].state;
    return !state || state === 'unknown' ? '' : state + endAdornment;
  };

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = (value) => this.setState({ anchorEl: null }, () => {
    if (Number(value))
      this.props.setTheme(value);
  });

  render() {
    const { classes, config, entities, themes, theme, moved, over, handleMouseOver, handleMouseLeave, handleRadioHide } = this.props;
    const { anchorEl } = this.state;

    const icon = config.header.left_outdoor_weather &&
      config.header.left_outdoor_weather.dark_sky_icon && this.getState(entities, config.header.left_outdoor_weather.dark_sky_icon);

    const header = {
      left_outdoor_weather: config.header.left_outdoor_weather && {
        icon: icon ? icon.replaceAll('-', '_').toUpperCase() : 'CLOUDY',
        condition: config.header.left_outdoor_weather.condition && this.getState(entities, config.header.left_outdoor_weather.condition),
        data: []
      },
      right_indoor: []
    };
    if (header.left_outdoor_weather)
      config.header.left_outdoor_weather.data.map(d => {
        return header.left_outdoor_weather.data.push(
          this.getState(entities, d.entity_id, d.unit_of_measurement)
        );
      });
    if (config.header.right_indoor)
      config.header.right_indoor.map(i => {
        var data = [];
        i.data.map(d => data.push(this.getState(entities, d.entity_id, d.unit_of_measurement)));
        return header.right_indoor.push({ label: i.label, data });
      });

    return (
      <div className={classes.root}>
        <div className={classes.header} onClick={handleRadioHide}>
          {header.left_outdoor_weather &&
            <div className={classes.weatherContainer}>
              <Typography className={classes.condition} variant="display2">
                {header.left_outdoor_weather.condition &&
                  <div className={classes.weatherIcon}>
                    <Hidden smDown>
                      <ReactAnimatedWeather
                        icon={header.left_outdoor_weather.icon}
                        color={theme.palette.text.main}
                        size={90}
                        animate={true} />
                    </Hidden>
                    <Hidden mdUp>
                      <ReactAnimatedWeather
                        icon={header.left_outdoor_weather.icon}
                        color={theme.palette.text.main}
                        size={60}
                        animate={true} />
                    </Hidden>
                  </div>
                }
                {header.left_outdoor_weather.condition && header.left_outdoor_weather.condition}
              </Typography>
              <Typography className={classes.data} variant="display2">
                {header.left_outdoor_weather.data.map((d, id) => {
                  return <span key={id}>{d}</span>
                })}
              </Typography>
            </div>
          }
          <div className={classes.timeDateContainer}>
            <Typography className={classes.time} variant="display4">
              <Moment format="hh:mm" />
              <Moment className={classes.timePeriod} format="a" />
            </Typography>
            <Typography className={classes.date} variant="display2">
              <Moment format="Do MMMM YYYY" />
            </Typography>
          </div>
          <div className={classes.indoorContainer}>
            {header.right_indoor && header.right_indoor.map((i, id) => {
              return (
                <div key={id} className={classes.indoorInnerContainer}>
                  <Typography className={classes.indoorLabel} variant="display2">
                    {i.label}
                  </Typography>
                  <Typography className={classes.indoor} variant="display2">
                    {i.data.map((d, id) => {
                      return <span key={id}>{d}</span>
                    })}
                  </Typography>
                </div>
              );
            })}
          </div>
        </div>
        {(moved || over) &&
          <div
            className={classes.buttons}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}>
            <IconButton
              className={classes.button}
              size="small"
              aria-label="Refresh"
              onClick={() => window.location.reload(true)}>
              <RefreshIcon className={classes.icon} />
            </IconButton>
            <IconButton
              className={classes.button}
              aria-label="Log Out"
              onClick={this.props.handleLogOut}>
              <ExitToAppIcon className={classes.icon} />
            </IconButton>
            <IconButton
              className={classes.button}
              aria-label="Theme"
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}>
              <BrushIcon className={classes.icon} />
            </IconButton>
            <IconButton
              className={classes.button}
              aria-label="Radio"
              onClick={this.props.handleRadioToggle}>
              <RadioIcon className={classes.icon} />
            </IconButton>
          </div>
        }
        <Menu
          id="theme"
          value={theme}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}>
          <MenuItem onClick={() => this.handleClose(-1)}>Auto</MenuItem>
          {themes.map(theme => {
            return (
              <MenuItem key={theme.id} onClick={() => this.handleClose(theme.id)}>{theme.name}</MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  moved: PropTypes.bool.isRequired,
  over: PropTypes.bool.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
  handleRadioToggle: PropTypes.func.isRequired,
  handleLogOut: PropTypes.func.isRequired,
  handleRadioHide: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);
