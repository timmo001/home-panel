import React from 'react';
import PropTypes from 'prop-types';
import Skycons from 'react-skycons';
import Moment from 'react-moment';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RefreshIcon from '@material-ui/icons/Refresh';
import BrushIcon from '@material-ui/icons/Brush';
import RadioIcon from '@material-ui/icons/Radio';
import config from 'config.json';

const styles = theme => ({
  header: {
    display: 'block',
    width: '100%',
    height: 180,
  },
  buttons: {
    position: 'fixed',
    display: 'grid',
    top: theme.spacing.unit,
    right: theme.spacing.unit,
  },
  timeDateContainer: {
    position: 'fixed',
    top: 12,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  time: {
    textAlign: 'center',
    color: theme.palette.defaultText.main,
    fontSize: '6rem',
  },
  timePeriod: {
    marginLeft: theme.spacing.unit * 2,
    fontSize: '3rem',
  },
  date: {
    color: theme.palette.defaultText.main,
    marginTop: theme.spacing.unit * -2.5,
    textAlign: 'center',
  },
  weatherContainer: {
    position: 'fixed',
    maxWidth: 360,
    top: 90,
    left: 0,
    transform: 'translateY(-50%)',
    textAlign: 'start',
  },
  condition: {
    paddingLeft: theme.spacing.unit * 17.2,
    color: theme.palette.defaultText.main,
    fontSize: '3.0rem',
  },
  weatherIcon: {
    position: 'fixed',
    transform: `translateX(-154px)`,
    top: 'calc(50% - 45px)',
    width: '190px !important',
    height: '90px !important',
  },
  data: {
    paddingLeft: theme.spacing.unit * 17.2,
    color: theme.palette.defaultText.main,
    fontSize: '2.0rem',
    '& span': {
      paddingLeft: theme.spacing.unit * 3,
    },
    '& span:first-child': {
      paddingLeft: 0,
    }
  },
  indoorContainer: {
    position: 'fixed',
    maxWidth: 360,
    top: 94,
    right: 0,
    transform: 'translateY(-50%)',
    textAlign: 'end',
  },
  indoorInnerContainer: {
    paddingTop: theme.spacing.unit,
    '&:first-child': {
      paddingTop: 0,
    }
  },
  indoorLabel: {
    minWidth: 200,
    paddingRight: theme.spacing.unit * 8,
    color: theme.palette.defaultText.main,
    fontSize: '2.2rem',
  },
  indoor: {
    minWidth: 200,
    paddingRight: theme.spacing.unit * 8,
    color: theme.palette.defaultText.main,
    fontSize: '2.0rem',
    '& span': {
      paddingLeft: theme.spacing.unit * 3,
    },
    '& span:first-child': {
      paddingLeft: 0,
    }
  },
});

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
    const { classes, entities, theme, moved, over, handleMouseOver, handleMouseLeave, handleRadioHide } = this.props;
    const { anchorEl } = this.state;

    const icon = config.header.left_outdoor_weather &&
      config.header.left_outdoor_weather.dark_sky_icon && this.getState(entities, config.header.left_outdoor_weather.dark_sky_icon);

    const header = {
      left_outdoor_weather: config.header.left_outdoor_weather && {
        icon: icon && icon.replaceAll('-', '_').toUpperCase(),
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
                  <Skycons
                    className={classes.weatherIcon}
                    color={theme.palette.defaultText.light}
                    icon={header.left_outdoor_weather.icon}
                    autoplay={true} />
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
            {header.right_indoor.map((i, id) => {
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
        {
          (moved || over) &&
          <div
            className={classes.buttons}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}>
            <IconButton
              className={classes.button}
              aria-label="Refresh"
              onClick={() => window.location.reload(true)}>
              <RefreshIcon />
            </IconButton>
            <IconButton
              className={classes.button}
              aria-label="Theme"
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}>
              <BrushIcon />
            </IconButton>
            <IconButton
              className={classes.button}
              aria-label="Radio"
              onClick={this.props.handleRadioToggle}>
              <RadioIcon />
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
          <MenuItem onClick={() => this.handleClose(1)}>Light</MenuItem>
          <MenuItem onClick={() => this.handleClose(2)}>Dark</MenuItem>
        </Menu>
      </div >
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  moved: PropTypes.bool.isRequired,
  over: PropTypes.bool.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
  handleRadioToggle: PropTypes.func.isRequired,
  handleRadioHide: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);