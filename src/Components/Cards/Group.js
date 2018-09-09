import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import CardBase from './CardBase';

const styles = theme => ({
  group: {
    height: `calc(100% + ${theme.spacing.unit}px)`,
    width: 274,
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      width: 226,
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
    paddingBottom: theme.spacing.unit * 2,
  },
});

class Group extends React.Component {

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
    const { classes, config, theme, handleChange, entities, group } = this.props;
    return (
      <Grid className={classes.group} item>
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
            {group.cards.map((card, x) => {
              return <CardBase key={x} theme={theme} entities={entities} card={card} handleChange={handleChange} config={config} />
            })}
          </Grid>
        </div>
      </Grid>
    );
  }
}

Group.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  entities: PropTypes.array.isRequired,
  group: PropTypes.object.isRequired,
};

export default withStyles(styles)(Group);
