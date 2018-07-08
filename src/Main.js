import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import Skycons from 'react-skycons';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BrushIcon from '@material-ui/icons/Brush';
import config from './config.json';
import Camera from './Camera';
import MoreInfo from './MoreInfo';

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
  },
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
  gridContainer: {
    height: `calc(100% - 160px)`,
    overflowY: 'auto',
  },
  grid: {
    height: '100%',
    width: 'fit-content',
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    flexWrap: 'nowrap',
  },
  group: {
    height: `calc(100% + ${theme.spacing.unit}px)`,
    width: '18rem',
    overflow: 'hidden',
  },
  title: {
    color: theme.palette.defaultText.light,
  },
  gridInnerContainer: {
    height: `calc(100% - ${theme.spacing.unit * 6}px)`,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  gridInner: {
    width: '100%',
  },
  cardContainer: {
    position: 'relative',
    width: '50%',
    padding: theme.spacing.unit / 2,
  },
  card: {
    cursor: 'pointer',
    minHeight: '8rem',
    height: '100%',
  },
  cardOn: {
    backgroundColor: theme.palette.backgrounds.dark,
  },
  cardContent: {
    height: '100%',
    padding: theme.spacing.unit * 2,
  },
  name: {
    fontSize: '1.2rem',
  },
  state: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    fontSize: '0.9rem',
  },
  cameraContainer: {
    position: 'relative',
    width: '100%',
    padding: theme.spacing.unit / 2,
  },
  camera: {
    width: '100%',
    height: '100%',
  }
});

var hoverTimeout;

// eslint-disable-next-line
String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

class Main extends React.Component {
  state = {
    anchorEl: null,
    moved: true,
    over: false,
    hovered: false,
    overlayOpacity: 0.00,
    camera: { open: false, data: null },
    moreInfo: {
      open: false,
      entity: null,
    },
  };

  componentWillMount = () => this.onMouseMoveHandler;

  getState = (entities, entity, endAdornment = '') => {
    const state = entities.find(i => {
      return i[1].entity_id === entity;
    })[1].state;
    return !state || state === 'unknown' ? '' : state + endAdornment;
  };

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = (themeId) => {
    this.setState({ anchorEl: null });
    this.props.setTheme(themeId);
  };

  onMouseMoveHandler = () => {
    clearTimeout(hoverTimeout);
    if (!this.state.over) {
      this.setState({ moved: true }, () => {
        hoverTimeout = setTimeout(() => {
          this.setState({ moved: false });
        }, 5000);
      });
    }
  };

  onMouseOverHandler = () => this.setState({ over: true });

  onMouseLeaveHandler = () => this.setState({ over: false });

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = (value) => this.setState({ anchorEl: null }, () => {
    this.props.setTheme(value);
  });

  handleShowCamera = (name, still_url, url) => this.setState({
    camera: { open: true, data: { name, still_url, url } }
  });

  handleButtonPress = (entity) => this.buttonPressTimer =
    setTimeout(() => this.setState({ moreInfo: { open: true, entity } }, () => { console.log('open') }), 1000);

  handleButtonRelease = () => clearTimeout(this.buttonPressTimer);

  render() {
    const { classes, entities, theme, handleChange } = this.props;
    const { anchorEl, moved, over, camera, moreInfo } = this.state;

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
      <div className={classes.root} onMouseMove={this.onMouseMoveHandler}>
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
              onMouseOver={this.onMouseOverHandler}
              onMouseLeave={this.onMouseLeaveHandler}>
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
        <div className={classes.gridContainer}>
          <Grid
            container
            className={classes.grid}
            spacing={16}>
            {config.items && config.items.map((group, x) => {
              return (
                <Grid key={x} className={classes.group} item>
                  <Typography className={classes.title} variant="display1" gutterBottom>
                    {group.name}
                  </Typography>
                  <div className={classes.gridInnerContainer}>
                    <Grid
                      container
                      className={classes.gridInner}
                      alignItems="stretch">
                      {group.cards.map((card, y) => {
                        const type = !card.type ? 'hass' : card.type;
                        if (type === 'hass') {
                          const entity = entities.find(i => { return i[1].entity_id === card.entity_id })[1];
                          const { entity_id, state, attributes } = entity;
                          const domain = entity_id.substring(0, entity_id.indexOf('.'));
                          return (
                            <Grid key={y} className={classes.cardContainer} item>
                              <Card className={classnames(
                                classes.card,
                                state === 'on' ? classes.cardOn : classes.cardOff
                              )} elevation={1} onClick={() => {
                                if (domain === 'light' || domain === 'switch')
                                  handleChange(domain, state === 'on' ? false : true, { entity_id });
                                else if (domain === 'scene' || domain === 'script')
                                  handleChange(domain, true, { entity_id });
                              }}
                                onTouchStart={() => this.handleButtonPress(entity)}
                                onMouseDown={() => this.handleButtonPress(entity)}
                                onTouchEnd={this.handleButtonRelease}
                                onMouseUp={this.handleButtonRelease}>
                                <CardContent className={classes.cardContent}>
                                  <Typography className={classes.name} variant="headline">
                                    {card.name ? card.name : attributes.friendly_name}
                                  </Typography>
                                  {domain === 'sensor' &&
                                    <Typography className={classes.state} variant="body1">
                                      {state}
                                    </Typography>
                                  }
                                </CardContent>
                              </Card>
                              {moreInfo.open &&
                                <MoreInfo
                                  theme={theme}
                                  data={moreInfo}
                                  handleChange={handleChange} />
                              }
                            </Grid>
                          );
                        } else if (type === 'camera') {
                          const { name, url } = card;
                          const still_url = `${card.still_url}?${new Date().getTime()}`;
                          return (
                            <Grid key={y} className={classes.cameraContainer} item>
                              <Card className={classes.card} elevation={1}>
                                <img
                                  className={classes.camera}
                                  src={still_url}
                                  alt={name}
                                  onClick={() => this.handleShowCamera(name, still_url, url)} />
                              </Card>
                            </Grid>
                          );
                        } else { return null; }
                      })}
                    </Grid>
                  </div>
                </Grid>
              )
            })}
          </Grid>
        </div>
        {camera.open &&
          <Camera
            data={camera}
            handleClose={() => this.setState({ camera: { open: false } })} />
        }
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  setTheme: PropTypes.func.isRequired,
  entities: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Main);
