import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import CardBase from './CardBase';

const styles = theme => ({
  group: {
    height: `calc(100% + ${theme.spacing.unit}px)`,
    width: 'calc(var(--width) * 138px)',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(var(--width) * 114px)',
    },
    marginRight: theme.spacing.unit
  },
  title: {
    color: theme.palette.text.light,
    fontSize: '1.7rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.4rem',
    }
  },
  gridInnerContainer: {
    height: 'calc(100% - 178px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100% - 132px)',
    }
  },
  gridInner: {
    width: '100%'
  }
});

class Group extends React.PureComponent {

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
    const { classes, haUrl, haConfig, config, editing, handleCardEdit,
      handleCardAdd, theme, handleChange, entities, groupId, group } = this.props;
    return (
      <Slide direction="up" in mountOnEnter unmountOnExit>
        <div>
          <Grid className={classes.group} style={{ '--width': group.width ? group.width : 2 }} item>
            <ButtonBase
              className={classes.groupButton}
              focusRipple
              disabled={this.checkGroupToggle(group, entities)}
              onClick={() => this.handleGroupToggle(group, entities)}>
              <Typography className={classes.title} variant="h4" gutterBottom>
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
                  if (!card) return null;
                  else if (card.entity_id && card.entity_id.startsWith('group')) {
                    const entity_outer = entities.find(i => { return i && i[1].entity_id === card.entity_id });
                    if (entity_outer)
                      return entity_outer[1].attributes.entity_id.map((entity, y) => {
                        return <CardBase
                          key={y}
                          config={config}
                          editing={editing}
                          handleCardAdd={handleCardAdd}
                          handleCardEdit={handleCardEdit}
                          theme={theme}
                          haUrl={haUrl}
                          haConfig={haConfig}
                          entities={entities}
                          groupId={groupId}
                          cardId={x}
                          card={{ ...card, entity_id: entity }}
                          handleChange={handleChange} />
                      });
                    else return null;
                  } else
                    return <CardBase
                      key={x}
                      config={config}
                      editing={editing}
                      handleCardAdd={handleCardAdd}
                      handleCardEdit={handleCardEdit}
                      theme={theme}
                      haUrl={haUrl}
                      haConfig={haConfig}
                      entities={entities}
                      groupId={groupId}
                      cardId={x}
                      card={card}
                      handleChange={handleChange} />
                })}
                {editing &&
                  <CardBase
                    config={config}
                    editing={editing}
                    handleCardAdd={handleCardAdd}
                    handleCardEdit={handleCardEdit}
                    theme={theme}
                    haUrl={haUrl}
                    haConfig={haConfig}
                    entities={entities}
                    groupId={groupId}
                    cardId={9999}
                    card={{ type: 'add' }}
                    handleChange={handleChange} />
                }
              </Grid>
            </div>
          </Grid>
        </div>
      </Slide>
    );
  }
}

Group.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  handleCardEdit: PropTypes.func.isRequired,
  handleCardAdd: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  haUrl: PropTypes.string.isRequired,
  haConfig: PropTypes.object,
  entities: PropTypes.array.isRequired,
  groupId: PropTypes.number.isRequired,
  group: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Group);
