import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { getCardElevation, getSquareCards } from '../../Common/config';
import properCase from '../../Common/properCase';
import AlarmPanel from './Dialogs/AlarmPanel';
import MoreInfo from './Dialogs/MoreInfo';
import Weather from './Weather';
import Climate from './Climate';
import Media from './Media';
import grid from '../../Common/Style/grid';
import card from '../../Common/Style/card';

const styles = theme => ({
  ...grid(theme),
  ...card(theme),
  state: {
    textOverflow: 'ellipsis',
    margin: 'auto',
    fontSize: '1.0rem',
    color: theme.palette.text.light,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    }
  },
  alarmArmedHome: {
    background: theme.palette.backgrounds.card.alarm.home
  },
  alarmArmedAway: {
    background: theme.palette.backgrounds.card.alarm.away
  },
  alarmTriggered: {
    background: theme.palette.backgrounds.card.alarm.triggered
  },
  climateHeat: {
    background: theme.palette.backgrounds.card.climate.heat
  },
  climateCool: {
    background: theme.palette.backgrounds.card.climate.cool
  }
});

class Hass extends React.PureComponent {
  state = {
    alarmEntity: undefined
  };

  handleButtonPress = (domain, entity) => {
    if (domain === 'light' && entity.state === 'on')
      this.buttonPressTimer =
        setTimeout(() => this.setState({ moreInfo: entity }), 1000);
  };

  handleAlarmPanelShow = (entity) => this.setState({ alarmEntity: entity });

  handleAlarmPanelClose = () => this.setState({ alarmEntity: undefined });

  handleButtonRelease = () => clearTimeout(this.buttonPressTimer);

  handleMoreInfoClose = () => this.setState({ moreInfo: undefined });

  render() {
    const { classes, config, editing, handleCardEdit, theme, handleChange,
      haUrl, haConfig, entities, groupId, cardId, card } = this.props;
    const { alarmEntity, moreInfo } = this.state;
    const entity_outer = entities.find(i => { return i[1].entity_id === card.entity_id });
    const cardElevation = getCardElevation(config);
    const squareCards = getSquareCards(config);
    if (entity_outer) {
      const entity = entity_outer[1];
      const { entity_id, state, attributes } = entity;
      const domain = entity_id.substring(0, entity_id.indexOf('.'));
      const name = card.name ? card.name : attributes.friendly_name;
      const icon = card.icon && card.icon;

      return (
        <Grid
          className={classes.cardContainer}
          style={{
            '--width': card.width ? card.width : 1,
            '--height': card.height ? card.height : 1,
          }}
          item>
          {domain === 'sensor'
            || domain === 'weather'
            || domain === 'climate'
            || domain === 'media_player'
            || domain === 'device_tracker' ?
            <Card className={classnames(
              classes.card,
              domain === 'climate' && state === 'heat' && classes.climateHeat,
              domain === 'climate' && state === 'cool' && classes.climateCool
            )} elevation={cardElevation} square={squareCards}>
              <CardContent className={classes.cardContent}>
                {domain === 'weather' ?
                  <Weather
                    theme={theme}
                    haConfig={haConfig}
                    card={card}
                    state={state}
                    attributes={attributes} />
                  :
                  <Typography className={classes.name} variant="h5" style={{
                    fontSize: card.size && card.size.name && card.size.name
                  }}>
                    {name}
                  </Typography>
                }
                {domain === 'climate' &&
                  <Climate
                    theme={theme}
                    haConfig={haConfig}
                    card={card}
                    name={name}
                    entity_id={entity_id}
                    state={state}
                    attributes={attributes}
                    handleChange={handleChange} />
                }
                {domain === 'media_player' &&
                  <Media
                    theme={theme}
                    haUrl={haUrl}
                    haConfig={haConfig}
                    card={card}
                    entity_id={entity_id}
                    state={state}
                    attributes={attributes}
                    handleChange={handleChange} />
                }
                {domain === 'sensor' &&
                  <Typography className={classes.state} variant="h5" component="h2" style={{
                    fontSize: card.size && card.size.state && card.size.state
                  }}>
                    {state}{attributes.unit_of_measurement}
                  </Typography>
                }
                {domain === 'device_tracker' &&
                  <Typography className={classes.state} variant="h5" component="h2" style={{
                    fontSize: card.size && card.size.state && card.size.state
                  }}>
                    {properCase(state)}
                  </Typography>
                }
                {icon &&
                  <i className={classnames('mdi', `mdi-${icon}`, classes.icon)} style={{
                    fontSize: card.size && card.size.state && card.size.state
                  }} />
                }
              </CardContent>
            </Card>
            :
            <ButtonBase
              className={classes.cardOuter}
              focusRipple
              disabled={editing ? false :
                state === 'unavailable'
                || state === 'pending'}
              onClick={() => {
                if (editing) handleCardEdit(groupId, cardId, card);
                else if (domain === 'light' || domain === 'switch')
                  handleChange(domain, state === 'on' ? false : true, { entity_id });
                else if (domain === 'scene' || domain === 'script')
                  handleChange(domain, true, { entity_id });
                else if (domain === 'alarm_control_panel')
                  this.handleAlarmPanelShow(entity);
              }}
              onTouchStart={() => this.handleButtonPress(domain, entity)}
              onMouseDown={() => this.handleButtonPress(domain, entity)}
              onTouchEnd={this.handleButtonRelease}
              onMouseUp={this.handleButtonRelease}>
              <Card className={classnames(
                classes.card,
                state === 'on' ? classes.cardOn : state === 'unavailable' ? classes.cardUnavailable : classes.cardOff,
                domain === 'alarm_control_panel' && state === 'armed_home' && classes.alarmArmedHome,
                domain === 'alarm_control_panel' && state === 'armed_away' && classes.alarmArmedAway,
                domain === 'alarm_control_panel' && state === 'triggered' && classes.alarmTriggered,
              )} elevation={cardElevation} square={squareCards}>
                <CardContent className={classes.cardContent}>
                  <Typography className={classes.name} variant="h5" style={{
                    fontSize: card.size && card.size.name && card.size.name
                  }}>
                    {name}
                  </Typography>
                  {domain === 'alarm_control_panel' &&
                    <Typography className={classes.state} variant="h5" component="h2">
                      {state.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                    </Typography>
                  }
                  {icon &&
                    <i className={classnames('mdi', `mdi-${icon}`, classes.icon)} style={{
                      fontSize: card.size && card.size.state && card.size.state
                    }} />
                  }
                </CardContent>
              </Card>
            </ButtonBase>
          }
          {alarmEntity &&
            <AlarmPanel
              entity={alarmEntity}
              handleChange={handleChange}
              handleClose={this.handleAlarmPanelClose} />
          }
          {moreInfo &&
            <MoreInfo
              theme={theme}
              data={moreInfo}
              handleChange={handleChange}
              handleClose={this.handleMoreInfoClose} />
          }
        </Grid>
      );
    } else return null;
  }
}

Hass.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  handleCardEdit: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  haUrl: PropTypes.string.isRequired,
  haConfig: PropTypes.object,
  entities: PropTypes.array.isRequired,
  groupId: PropTypes.number.isRequired,
  cardId: PropTypes.number.isRequired,
  card: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default withStyles(styles)(Hass);
