import React from 'react';
import PropTypes from 'prop-types';
// import JSONInput from 'react-json-editor-ajrm';
// import locale from 'react-json-editor-ajrm/locale/en';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardBase from '../Cards/CardBase';
import defaultConfig from './defaultConfig.json';
import ConfirmDialog from '../Common/ConfirmDialog';
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
  },
  fill: {
    flex: '1 1 auto'
  }
});

class EditCard extends React.PureComponent {
  state = {
    open: true,
    defaultCard: clone(defaultConfig.items[0].cards.find(c => c.type === this.props.card.type))
      || defaultConfig.items[0].cards[0],
    card: clone(this.props.card),
    // jsonEdit: false
  };

  handleJSONEditor = () => this.setState({ jsonEdit: clone(this.state.card) });

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

  handleDeleteConfirm = () => this.setState({ confirm: true });

  handleDeleteConfirmClose = () => this.setState({ confirm: false });

  handleDelete = () => this.handleClose(() => {
    this.setState({ confirm: false }, () => {
      const path = ['items', this.props.groupId, 'cards', this.props.cardId];
      this.props.add ? this.props.handleCardAddDone(path)
        : this.props.handleCardEditDone(path);
    });
  });

  handleConfigChange = (path, value) => {
    const cardLcl = clone(this.state.card),
      defaultConfigLcl = clone(defaultConfig);

    console.log('card pre:', cardLcl);

    const key = path.pop();
    cardLcl[key] = value;
    const defaultCard = defaultConfigLcl.items[0].cards.find(c => c.type === cardLcl.type)
      || defaultConfigLcl.items[0].cards[0];
    if (key === 'type') {
      // Delete any unused props and set the new props
      Object.keys(cardLcl).map(c => !defaultCard[c] ? delete cardLcl[c] : cardLcl[c] = defaultCard[c]);
      Object.keys(defaultCard).map(c => !cardLcl[c] ? cardLcl[c] = defaultCard[c] : null);
    }
    // Fix type if not set
    if (!cardLcl.type) cardLcl.type = defaultConfigLcl.items[0].cards[0].type;
    this.setState({ defaultCard, card: cardLcl });
  };

  render() {
    const { classes, add, config, theme, haUrl, haConfig, entities, groupId, cardId } = this.props;
    const { open, defaultCard, card, confirm, /*jsonEdit*/ } = this.state;
    if (!open) return null;
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
          {/* {jsonEdit ?
            <JSONInput
              id="card"
              theme="dark_vscode_tribute"
              placeholder={clone(jsonEdit)}
              locale={locale}
              onChange={data => this.handleConfigChange(['items', groupId, 'cards', cardId], clone(data.jsObject))} />
            : */}
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
          {/* } */}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDeleteConfirm} color="primary">
            Delete
          </Button>
          {/* <Button onClick={this.handleJSONEditor} color="primary">
            {jsonEdit ? 'Standard Editor' : 'JSON Editor'}
          </Button> */}
          <div className={classes.fill} />
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
            {add ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
        {confirm &&
          <ConfirmDialog
            text="Do you want to delete this card?"
            handleClose={this.handleDeleteConfirmClose}
            handleConfirm={this.handleDelete} />
        }
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
