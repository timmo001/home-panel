import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ReactAnimatedWeather from 'react-animated-weather';
import Moment from 'react-moment';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import RefreshIcon from '@material-ui/icons/Refresh';
import FormatPaintIcon from '@material-ui/icons/FormatPaint';
import EditIcon from '@material-ui/icons/Edit';
import RadioIcon from '@material-ui/icons/Radio';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const styles = theme => ({
  header: {
    width: '100%',
  },
  timeDateContainer: {
    width: 420,
    [theme.breakpoints.down('md')]: {
      width: 340,
    },
    [theme.breakpoints.down('sm')]: {
      width: 240,
    }
  },
  time: {
    textAlign: 'center',
    color: theme.palette.text.main,
    fontSize: '5.2rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '4.2rem'
    },
    overflow: 'visible'
  },
  timePeriod: {
    paddingLeft: theme.spacing.unit,
    fontSize: '2.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.2rem'
    },
    overflow: 'visible'
  },
  date: {
    color: theme.palette.text.main,
    marginTop: -18,
    textAlign: 'center',
    overflow: 'visible',
    fontSize: '1.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.4rem'
    }
  },
  dateMilitary: {
    marginTop: theme.spacing.unit * -0.88,
  },
  weatherContainer: {
    width: 420,
    [theme.breakpoints.down('md')]: {
      width: 340,
    },
    [theme.breakpoints.down('sm')]: {
      width: 240,
    },
    [theme.breakpoints.down('xs')]: {
      width: 0,
      visibility: 'hidden'
    },
    paddingLeft: theme.spacing.unit * 2,
    textAlign: 'start'
  },
  condition: {
    color: theme.palette.text.main,
    fontSize: '2.2rem',
    overflow: 'visible',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem'
    }
  },
  data: {
    maxWidth: 420,
    color: theme.palette.text.main,
    fontSize: '1.6rem',
    '& span': {
      paddingLeft: theme.spacing.unit * 2,
    },
    '& span:first-child': {
      paddingLeft: 0,
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: 340,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: 240,
      fontSize: '1.2rem'
    }
  },
  indoorContainer: {
    width: 420,
    [theme.breakpoints.down('md')]: {
      width: 340,
    },
    [theme.breakpoints.down('sm')]: {
      width: 240,
    },
    [theme.breakpoints.down('xs')]: {
      width: 0,
      visibility: 'hidden'
    },
    paddingRight: theme.spacing.unit * 2,
    textAlign: 'end'
  },
  indoorInnerContainer: {
    paddingTop: theme.spacing.unit / 2,
    '&:first-child': {
      paddingTop: 0,
    }
  },
  indoorLabel: {
    color: theme.palette.text.main,
    fontSize: '2.0rem',
    overflow: 'visible',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem'
    },
  },
  indoor: {
    color: theme.palette.text.main,
    overflow: 'visible',
    fontSize: '1.6rem',
    '& span': {
      paddingLeft: theme.spacing.unit * 2,
    },
    '& span:first-child': {
      paddingLeft: 0,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem'
    },
  },
  buttons: {
    position: 'fixed',
    top: 0,
    margin: 2,
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
      margin: 0
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  button: {
    height: 32,
    width: 32,
    color: theme.palette.text.light,
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing.unit * 1.5,
    },
    [theme.breakpoints.down('sm')]: {
      height: 26,
      width: 26,
      gridColumn: 1
    }
  },
  icon: {
    height: 22,
    width: 22,
    [theme.breakpoints.down('sm')]: {
      height: 18,
      width: 18,
    }
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
    const { classes, config, entities, themes, theme, moved, over,
      handleMouseOver, handleMouseLeave, handleRadioHide } = this.props;
    const { anchorEl } = this.state;

    if (!config.header) config.header = {};

    const icon = config.header.left_outdoor_weather &&
      config.header.left_outdoor_weather.dark_sky_icon &&
      this.getState(entities, config.header.left_outdoor_weather.dark_sky_icon);

    const header = {
      left_outdoor_weather: config.header.left_outdoor_weather && {
        icon: icon && icon.replaceAll('-', '_').toUpperCase(),
        condition: config.header.left_outdoor_weather.condition &&
          this.getState(entities, config.header.left_outdoor_weather.condition),
        data: []
      },
      right_indoor: []
    };
    if (config.header.left_outdoor_weather && config.header.left_outdoor_weather.data)
      config.header.left_outdoor_weather.data.map(d => {
        return header.left_outdoor_weather.data.push(
          this.getState(entities, d.entity_id, d.unit_of_measurement)
        );
      });
    if (config.header.right_indoor)
      config.header.right_indoor.map(i => {
        var data = [];
        if (i.data)
          i.data.map(d => data.push(this.getState(entities, d.entity_id, d.unit_of_measurement)));
        return header.right_indoor.push({ label: i.label, data });
      });

    var timeMilitary = false;
    if (config.header.format && config.header.format.time && config.header.format.time.military)
      timeMilitary = config.header.format.time.military
    var dateFormat = 'Do MMMM YYYY';
    if (config.header.format && config.header.format.date) dateFormat = config.header.format.date;

    const canEdit = !process.env.REACT_APP_OVERRIDE_API_URL ? true : false;

    return (
      <div className={classes.root}>
        <Grid
          container
          className={classes.header}
          direction="row"
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
          spacing={8}
          onClick={handleRadioHide}>
          {header.left_outdoor_weather &&
            <Grid item className={classes.weatherContainer}>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                wrap="nowrap"
                spacing={8}>

                {header.left_outdoor_weather.icon &&
                  <Grid item>
                    <Hidden smDown>
                      <ReactAnimatedWeather
                        icon={header.left_outdoor_weather.icon}
                        color={theme.palette.text.main}
                        size={80}
                        animate={true} />
                    </Hidden>
                    <Hidden mdUp>
                      <ReactAnimatedWeather
                        icon={header.left_outdoor_weather.icon}
                        color={theme.palette.text.main}
                        size={60}
                        animate={true} />
                    </Hidden>
                  </Grid>
                }
                <Grid item>
                  {header.left_outdoor_weather.condition &&
                    <Typography className={classes.condition} variant="display2" noWrap>
                      {header.left_outdoor_weather.condition && header.left_outdoor_weather.condition}
                    </Typography>
                  }
                  {header.left_outdoor_weather.data &&
                    <Typography className={classes.data} variant="display2" noWrap>
                      {header.left_outdoor_weather.data.map((d, id) => {
                        return <span key={id}>{d}</span>
                      })}
                    </Typography>
                  }
                </Grid>
              </Grid>
            </Grid>
          }
          <Grid item className={classes.timeDateContainer}>
            {timeMilitary ?
              <Typography className={classes.time} variant="display4" noWrap>
                <Moment format="HH:mm" />
              </Typography>
              :
              <Typography className={classnames(classes.time, timeMilitary && classes.dateMilitary)} variant="display4" noWrap>
                <Moment format="hh:mm" />
                <Moment className={classes.timePeriod} format="a" />
              </Typography>
            }
            <Typography className={classes.date} variant="display2" noWrap>
              <Moment format={dateFormat} />
            </Typography>
          </Grid>
          <Grid item className={classes.indoorContainer}>
            {header.right_indoor && header.right_indoor.map((i, id) => {
              return (
                <div key={id} className={classes.indoorInnerContainer}>
                  <Typography className={classes.indoorLabel} variant="display2" noWrap>
                    {i.label}
                  </Typography>
                  <Typography className={classes.indoor} variant="display2" noWrap>
                    {i.data.map((d, id) => {
                      return <span key={id}>{d}</span>
                    })}
                  </Typography>
                </div>
              );
            })}
          </Grid>
        </Grid>
        <Fade in={moved || over}>
          <div
            className={classes.buttons}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}>
            <IconButton
              className={classes.button}
              aria-label="Log Out"
              onClick={this.props.handleLogOut}>
              <ExitToAppIcon className={classes.icon} />
            </IconButton>
            <IconButton
              className={classes.button}
              size="small"
              aria-label="Refresh"
              onClick={() => window.location.reload(true)}>
              <RefreshIcon className={classes.icon} />
            </IconButton>
            {canEdit &&
              <IconButton
                className={classes.button}
                aria-label="Edit Config"
                onClick={this.props.handleEditConfig}>
                <EditIcon className={classes.icon} />
              </IconButton>
            }
            <IconButton
              className={classes.button}
              style={{ gridRow: 1, gridColumn: 2 }}
              aria-label="Theme"
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}>
              <FormatPaintIcon className={classes.icon} />
            </IconButton>
            <IconButton
              className={classes.button}
              style={{ gridRow: 2, gridColumn: 2 }}
              aria-label="Radio"
              onClick={this.props.handleRadioToggle}>
              <RadioIcon className={classes.icon} />
            </IconButton>
          </div>
        </Fade>
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
  handleEditConfig: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);
