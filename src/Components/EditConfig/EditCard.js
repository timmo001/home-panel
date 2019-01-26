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
    card: this.props.card
  };

  handleClose = cb => this.setState({ open: false }, cb);

  handleCancel = () => this.handleClose(() => {
    this.props.add ? this.props.handleCardEditDone()
      : this.props.handleCardEditDone();
  });

  handleSave = () => this.handleClose(() => {
    const path = ['items', this.props.groupId, 'cards', this.props.cardId];
    this.props.add ? this.props.handleCardAddDone(path, this.state.card)
      : this.props.handleCardEditDone(path, this.state.card);
  });

  handleConfigChange = (path, value) => {
    const { card } = this.props;
    card[path.pop()] = value;
    this.setState({ card });
  };

  render() {
    const { classes, add, config, theme, haUrl, haConfig, entities, groupId, cardId } = this.props;
    const { open, card } = this.state;

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
            {Object.keys(defaultConfig.items[0].cards[0]).map((i, x) =>
              <Item
                key={x}
                objKey={i}
                defaultItem={defaultConfig.items[0].cards[0][i]}
                item={card[i] !== undefined ? card[i] : defaultConfig.items[0].cards[0][i]}
                defaultItemPath={['items', 0, 'cards', 0, i]}
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
