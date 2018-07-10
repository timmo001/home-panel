import React from 'react';
import PropTypes from 'prop-types';
import Skycons from 'react-skycons';
import Moment from 'react-moment';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BrushIcon from '@material-ui/icons/Brush';
import config from '../config.json';

const styles = theme => ({
  header: {
    display: 'block',
    width: '100%',
    height: 180,
  },
  buttons: {
    position: 'fixed',
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
    paddingLeft: theme.spacing.unit * 17,
    color: theme.palette.defaultText.main,
    fontSize: '3.0rem',
  },
  weatherIcon: {
    position: 'fixed',
    transform: `translateX(-158px)`,
    top: 'calc(50% - 45px)',
    width: '190px !important',
    height: '90px !important',
  },
  data: {
    paddingLeft: theme.spacing.unit * 17,
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

class Camera extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = (value) => this.setState({ anchorEl: null }, () => {
    this.props.setTheme(value);
  });

  render() {
    const { classes, entities, theme, moved, over, handleMouseOver, handleMouseLeave } = this.props;
    const { anchorEl } = this.state;

    const header = {
      left_outdoor_weather: {
        icon: this.getState(entities, config.header.left_outdoor_weather.dark_sky_icon)
          .replaceAll('-', '_').toUpperCase(),
        condition: this.getState(entities, config.header.left_outdoor_weather.condition),
        data: []
      },
      right_indoor: []
    };
    config.header.left_outdoor_weather.data.map(d => {
      return header.left_outdoor_weather.data.push(
        this.getState(entities, d.entity_id, d.unit_of_measurement)
      );
    });
    config.header.right_indoor.map(i => {
      var data = [];
      i.data.map(d => data.push(this.getState(entities, d.entity_id, d.unit_of_measurement)));
      return header.right_indoor.push({ label: i.label, data });
    });

    return (
      <div className={classes.header}>
        <div className={classes.weatherContainer}>
          <Typography className={classes.condition} variant="display2">
            <Skycons
              className={classes.weatherIcon}
              color={theme.palette.defaultText.light}
              icon={header.left_outdoor_weather.icon}
              autoplay={true} />
            {header.left_outdoor_weather.condition}
          </Typography>
          <Typography className={classes.data} variant="display2">
            {header.left_outdoor_weather.data.map((d, id) => {
              return <span key={id}>{d}</span>
            })}
          </Typography>
        </div>
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
        {(moved || over) &&
          <div
            className={classes.buttons}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}>
            <IconButton
              className={classes.button}
              aria-label="Theme"
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}>
              <BrushIcon />
            </IconButton>
            <Menu
              id="theme"
              value={theme}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}>
              <MenuItem onClick={() => this.handleClose(-1)}>Auto</MenuItem>
              <MenuItem onClick={() => this.handleClose(0)}>Light</MenuItem>
              <MenuItem onClick={() => this.handleClose(1)}>Dark</MenuItem>
            </Menu>
          </div>
        }
      </div>
    );
  }
}

Camera.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  moved: PropTypes.object.isRequired,
  over: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
};

export default withStyles(styles)(Camera);