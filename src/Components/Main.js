import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Camera from './Camera';
import Header from './Header';
import MoreInfo from './MoreInfo';
import Radio from './Radio';
import AlarmPanel from './AlarmPanel';

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
  },
  gridContainer: {
    height: `calc(100% - 180px)`,
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      height: `calc(100% - 130px)`,
    }
  },
  grid: {
    height: '100%',
    width: 'fit-content',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    flexWrap: 'nowrap',
    overflowY: 'hidden',
  },
  group: {
    height: `calc(100% + ${theme.spacing.unit}px)`,
    width: '18rem',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      width: '14rem',
    }
  },
  title: {
    color: theme.palette.text.light,
    fontSize: '1.7rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.4rem',
    }
  },
  gridInnerContainer: {
    height: `calc(100% - ${theme.spacing.unit * 6}px)`,
    overflowY: 'auto',
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
      height: `calc(100% - ${theme.spacing.unit * 4}px)`,
    }
  },
  gridInner: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 3,
  },
  cardContainer: {
    position: 'relative',
    width: '50%',
    padding: theme.spacing.unit / 2,
  },
  cardOuter: {
    height: '100%',
    width: '100%',
    textAlign: 'start',
  },
  card: {
    width: '100%',
    background: theme.palette.backgrounds.card.off,
  },
  cardOn: {
    background: theme.palette.backgrounds.card.on,
  },
  cardUnavailable: {
    background: theme.palette.backgrounds.card.disabled,
  },
  cardContent: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 98,
    height: 98,
    [theme.breakpoints.down('sm')]: {
      minHeight: 74,
      height: 74,
    },
    padding: `${theme.spacing.unit * 1.5}px !important`,
  },
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '1.12rem',
    fontColor: theme.palette.text.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    }
  },
  state: {
    textOverflow: 'ellipsis',
    margin: '0 auto',
    marginTop: theme.spacing.unit / 2,
    fontSize: '1.0rem',
    fontColor: theme.palette.text.light,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    }
  },
  cameraContainer: {
    position: 'relative',
    width: '100%',
    padding: theme.spacing.unit / 2,
  },
  camera: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
  icon: {
    margin: '0 auto',
    color: theme.palette.text.icon,
    fontSize: '2.7rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.7rem',
    }
  },
});

var hoverTimeout;

class Main extends React.Component {
  state = {
    moved: false,
    over: false,
    hovered: false,
    radioShown: false,
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
        }, 10000);
      });
    }
  };

  onMouseOverHandler = () => this.setState({ over: true });

  onMouseLeaveHandler = () => this.setState({ over: false });

  handleShowCamera = (name, still_url, url) => this.setState({
    camera: { name, still_url, url }
  });

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = (value) => this.setState({ anchorEl: null }, () => {
    this.props.setTheme(value);
  });

  handleButtonPress = (domain, entity) => {
    if (domain === 'light' && entity.state === 'on')
      this.buttonPressTimer =
        setTimeout(() => this.setState({ moreInfo: entity }), 1000);
  };

  handleButtonRelease = () => clearTimeout(this.buttonPressTimer);

  handleCameraClose = () => this.setState({ camera: undefined });

  handleMoreInfoClose = () => this.setState({ moreInfo: undefined });

  handleAlarmPanelShow = (entity) => this.setState({ alarmEntity: entity });

  handleAlarmPanelClose = () => this.setState({ alarmEntity: undefined });

  handleRadioShow = () => this.setState({ radioShown: true });

  handleRadioHide = () => this.setState({ radioShown: false });

  handleRadioToggle = () => this.setState({ radioShown: !this.state.radioShown });

  handleLogOut = () => {
    sessionStorage.removeItem('password');
    window.location.reload(true);
  };

  checkGroupToggle = (group, entities) => {
    const card = group.cards.find((card) => {
      const type = !card.type ? 'hass' : card.type;
      if (type === 'hass') {
        const entity_outer = entities.find(i => { return i[1].entity_id === card.entity_id });
        if (entity_outer) {
          const entity = entity_outer[1];
          const { entity_id } = entity;
          const domain = entity_id.substring(0, entity_id.indexOf('.'));
          return domain === 'light' || domain === 'switch';
        } else return false;
      } else return false;
    });
    return card === undefined;
  };

  handleGroupToggle = (group, entities) => {
    // Check if one card is 'on'
    const oneOn = group.cards.find((card) => {
      const type = !card.type ? 'hass' : card.type;
      if (type === 'hass') {
        const entity_outer = entities.find(i => { return i[1].entity_id === card.entity_id });
        if (entity_outer) {
          const entity = entity_outer[1];
          const { entity_id, state } = entity;
          const domain = entity_id.substring(0, entity_id.indexOf('.'));
          if (domain === 'light' || domain === 'switch')
            return state === 'on';
        }
      }
      return false;
    });
    // Switch all cards on/off
    group.cards.map((card) => {
      const type = !card.type ? 'hass' : card.type;
      if (type === 'hass') {
        const entity_outer = entities.find(i => { return i[1].entity_id === card.entity_id });
        if (entity_outer) {
          const entity = entity_outer[1];
          const { entity_id } = entity;
          const domain = entity_id.substring(0, entity_id.indexOf('.'));
          if (domain === 'light' || domain === 'switch') {
            this.props.handleChange(domain, oneOn ? false : true, { entity_id });
          }
        }
      }
      return null;
    });
  };

  render() {
    const { handleCameraClose, handleMoreInfoClose, handleRadioHide, handleAlarmPanelShow } = this;
    const { classes, entities, config, themes, theme, handleChange } = this.props;
    const { moved, over, camera, moreInfo, radioShown, alarmEntity } = this.state;

    return (
      <div className={classes.root} onMouseMove={this.onMouseMoveHandler}>
        <Header
          config={config}
          entities={entities}
          themes={themes}
          theme={theme}
          moved={moved}
          over={over}
          handleMouseOver={this.onMouseMoveHandler}
          handleMouseLeave={this.onMouseLeaveHandler}
          setTheme={this.props.setTheme}
          handleRadioToggle={this.handleRadioToggle}
          handleLogOut={this.handleLogOut}
          handleRadioHide={handleRadioHide} />
        <div className={classes.gridContainer} onClick={handleRadioHide}>
          <Grid
            container
            className={classes.grid}
            spacing={8}>
            {config.items && config.items.map((group, x) => {
              return (
                <Grid key={x} className={classes.group} item>
                  <ButtonBase
                    className={classes.groupButton}
                    focusRipple
                    disabled={this.checkGroupToggle(group, entities)}
                    onClick={() => this.handleGroupToggle(group, entities)}>
                    <Typography className={classes.title} variant="display1" gutterBottom>
                      {group.name}
                    </Typography>
                  </ButtonBase>
                  <div className={classes.gridInnerContainer}>
                    <Grid
                      container
                      className={classes.gridInner}
                      alignItems="stretch"
                      spacing={8}>
                      {group.cards.map((card, y) => {
                        const type = !card.type ? 'hass' : card.type;
                        const icon = card.icon && card.icon;
                        if (type === 'hass') {
                          const entity_outer = entities.find(i => { return i[1].entity_id === card.entity_id });
                          if (entity_outer) {
                            const entity = entity_outer[1];
                            const { entity_id, state, attributes } = entity;
                            const domain = entity_id.substring(0, entity_id.indexOf('.'));
                            const name = card.name ? card.name : attributes.friendly_name;
                            return (
                              <Grid key={y} className={classes.cardContainer} item>
                                <ButtonBase
                                  className={classes.cardOuter}
                                  focusRipple
                                  disabled={state === 'unavailable' || domain === 'sensor'}
                                  onClick={() => {
                                    if (domain === 'light' || domain === 'switch')
                                      handleChange(domain, state === 'on' ? false : true, { entity_id });
                                    else if (domain === 'scene' || domain === 'script')
                                      handleChange(domain, true, { entity_id });
                                    else if (domain === 'alarm_control_panel')
                                      handleAlarmPanelShow(entity);
                                  }}
                                  onTouchStart={() => this.handleButtonPress(domain, entity)}
                                  onMouseDown={() => this.handleButtonPress(domain, entity)}
                                  onTouchEnd={this.handleButtonRelease}
                                  onMouseUp={this.handleButtonRelease}>
                                  <Card className={classnames(
                                    classes.card,
                                    state === 'on' ? classes.cardOn : state === 'unavailable' ? classes.cardUnavailable : classes.cardOff
                                  )} elevation={1} square>
                                    <CardContent className={classes.cardContent}>
                                      <Typography className={classes.name} variant="headline">
                                        {name}
                                      </Typography>
                                      {domain === 'sensor' &&
                                        <Typography className={classes.state} variant="headline" component="h2">
                                          {state}{attributes.unit_of_measurement}
                                        </Typography>
                                      }
                                      {icon &&
                                        <i className={classnames('mdi', `mdi-${icon}`, classes.icon)} />
                                      }
                                    </CardContent>
                                  </Card>
                                </ButtonBase>
                              </Grid>
                            );
                          } else return null;
                        } else if (type === 'link') {
                          const { name, url } = card;
                          return (
                            <Grid key={y} className={classes.cardContainer} item>
                              <ButtonBase
                                className={classes.cardOuter}
                                focusRipple
                                href={url}
                                target="_blank">
                                <Card className={classes.card} elevation={1} square>
                                  <CardContent className={classes.cardContent}>
                                    <Typography className={classes.name} variant="headline">
                                      {name}
                                    </Typography>
                                    {icon &&
                                      <i className={classnames('mdi', `mdi-${icon}`, classes.icon)} />
                                    }
                                  </CardContent>
                                </Card>
                              </ButtonBase>
                            </Grid>
                          );
                        } else if (type === 'camera') {
                          const { name, url } = card;
                          const still_url = `${card.still_url}?${moment().format('HHmm')}`;
                          return (
                            <Grid key={y} className={classes.cameraContainer} item>
                              <ButtonBase className={classes.cardOuter} focusRipple
                                onClick={() => this.handleShowCamera(name, still_url, url)}>
                                <Card className={classes.card} elevation={1} square>
                                  <img
                                    className={classes.camera}
                                    src={still_url}
                                    alt={name} />
                                </Card>
                              </ButtonBase>
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
        {camera &&
          <Camera
            data={camera}
            handleClose={handleCameraClose} />
        }
        {moreInfo &&
          <MoreInfo
            theme={theme}
            data={moreInfo}
            handleChange={handleChange}
            handleClose={handleMoreInfoClose} />
        }
        <Radio
          show={radioShown}
          apiUrl={this.props.apiUrl}
          handleRadioHide={handleRadioHide} />
        {alarmEntity &&
          <AlarmPanel
            entity={alarmEntity}
            handleChange={handleChange}
            handleClose={handleMoreInfoClose} />
        }
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  setTheme: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  apiUrl: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Main);