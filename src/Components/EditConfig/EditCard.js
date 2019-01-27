import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardBase from '../Cards/CardBase';
import defaultConfig from './defaultConfig.json';
import Item from './Item';
import clone from '../Common/clone';

const styles = theme => ({
  dialog: {
    overflow: 'none'
  },
  dialogContent: {
    overflowX: 'auto'
  },
  cardContainer: {
    margin: theme.spacing.unit
  }
});

class EditCard extends React.Component {
  state = {
    open: true,
    defaultCard: clone(defaultConfig.items[0].cards.find(c => c.type === this.props.card.type))
      || defaultConfig.items[0].cards[0],
    card: clone(this.props.card)
  };

  handleClose = cb => this.setState({ open: false }, cb);

  handleCancel = () => this.handleClose(() => {
    this.props.add ? this.props.handleCardAddDone()
      : this.props.handleCardEditDone();
  });

  handleSave = () => this.handleClose(() => {
    const path = ['items', this.props.groupId, 'cards', this.props.cardId];
    this.props.add ? this.props.handleCardAddDone(path, this.state.card)
      : this.props.handleCardEditDone(path, this.state.card);
  });

  handleConfigChange = (path, value) => {
    const { card } = this.props;
    const key = path.pop();
    card[key] = value;
    const defaultCard = defaultConfig.items[0].cards.find(c => c.type === value)
      || defaultConfig.items[0].cards[0];
    if (key === 'type') {
      // Delete any unused props and set the new props
      Object.keys(card).map(c => !defaultCard[c] ? delete card[c] : card[c] = defaultCard[c]);
      Object.keys(defaultCard).map(c => !card[c] ? card[c] = defaultCard[c] : null);
    }
    // Fix type if not set
    if (!card.type) card.type = defaultConfig.items[0].cards[0].type;
    this.setState({ defaultCard, card });
  };

  render() {
    const { classes, add, config, theme, haUrl, haConfig, entities, groupId, cardId } = this.props;
    const { open, defaultCard, card } = this.state;
    const typePath = defaultConfig.items[0].cards.findIndex(c => c.type === card.type);

    return (
      <Dialog
        className={classes.dialog}
        open={open}
        maxWidth="md"
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{add ? 'Add' : 'Edit'} Card</DialogTitle>
        <div className={classes.cardContainer}>
          <Grid container justify="center">
            <CardBase
              className={classes.card}
              config={config}
              editing
              handleCardEdit={() => null}
              handleCardAdd={() => null}
              theme={theme}
              haUrl={haUrl}
              haConfig={haConfig}
              entities={entities}
              groupId={groupId}
              cardId={cardId}
              card={card}
              handleChange={() => null} />
          </Grid>
        </div>
        <DialogContent className={classes.dialogContent}>
          <Grid container direction="column">
            {Object.keys(defaultCard).map((i, x) =>
              <Item
                key={x}
                objKey={i}
                defaultItem={defaultCard[i]}
                item={card[i] !== undefined ? card[i] : defaultCard[i]}
                defaultItemPath={['items', 0, 'cards', typePath > -1 ? typePath : 0, i]}
                itemPath={['items', groupId, 'cards', cardId, i]}
                handleConfigChange={this.handleConfigChange} />
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
            {add ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  haUrl: PropTypes.string.isRequired,
  haConfig: PropTypes.object,
  entities: PropTypes.array.isRequired,
  groupId: PropTypes.number.isRequired,
  cardId: PropTypes.number.isRequired,
  card: PropTypes.object,
  add: PropTypes.bool,
  handleCardAddDone: PropTypes.func,
  handleCardEditDone: PropTypes.func
};

export default withStyles(styles)(EditCard);
