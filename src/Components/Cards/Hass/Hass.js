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
import AlarmPanel from './Dialogs/AlarmPanel';
import MoreInfo from './Dialogs/MoreInfo';
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
    background: theme.palette.backgrounds.card.alarm.home,
  },
  alarmArmedAway: {
    background: theme.palette.backgrounds.card.alarm.away,
  },
  alarmTriggered: {
    background: theme.palette.backgrounds.card.alarm.triggered,
  }
});

class Hass extends React.Component {
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
    const { classes, config, theme, handleChange, entities, card } = this.props;
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
          <ButtonBase
            className={classes.cardOuter}
            focusRipple
            disabled={state === 'unavailable' || domain === 'sensor' || state === 'pending'}
            onClick={() => {
              if (domain === 'light' || domain === 'switch')
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
                <Typography className={classes.name} variant="headline" style={{
                  fontSize: card.size && card.size.name && card.size.name
                }}>
                  {name}
                </Typography>
                {domain === 'sensor' &&
                  <Typography className={classes.state} variant="headline" component="h2" style={{
                    fontSize: card.size && card.size.state && card.size.state
                  }}>
                    {state}{attributes.unit_of_measurement}
                  </Typography>
                }
                {domain === 'alarm_control_panel' &&
                  <Typography className={classes.state} variant="headline" component="h2">
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
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  entities: PropTypes.array.isRequired,
  card: PropTypes.object.isRequired,
};

export default withStyles(styles)(Hass);
