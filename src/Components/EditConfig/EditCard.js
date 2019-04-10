import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import withStyles from '@material-ui/core/styles/withStyles';
import ArrowDownwardsIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import CardBase from '../Cards/CardBase';
import dc from './defaultConfig.json';
import ConfirmDialog from '../Common/ConfirmDialog';
import Item from './Item';
import clone from '../Common/clone';

const defaultConfig = clone(dc);

const styles = theme => ({
  title: {
    paddingBottom: 0
  },
  root: {
    display: 'flex',
    overflow: 'hidden',
    maxHeight: '100%'
  },
  container: {
    flex: '1 1 auto'
  },
  cardContainer: {
    padding: theme.spacing.unit * 2
  },
  dialogContent: {
    height: 'calc(100% - 32px)',
    maxHeight: 'calc(100% - 32px)',
    padding: theme.spacing.unit
  },
  fill: {
    flex: '1 1 auto'
  }
});

class EditCard extends React.PureComponent {
  state = {
    open: true,
    defaultCard:
      clone(
        defaultConfig.items[0].cards.find(c => c.type === this.props.card.type)
      ) || defaultConfig.items[0].cards[0],
    card: clone(this.props.card)
  };

  handleJSONEditor = () => this.setState({ jsonEdit: clone(this.state.card) });

  handleClose = cb => this.setState({ open: false }, cb);

  handleCancel = () =>
    this.handleClose(() => {
      this.props.add
        ? this.props.handleCardAddDone()
        : this.props.handleCardEditDone();
    });

  handleSave = () =>
    this.handleClose(() => {
      const path = ['items', this.props.groupId, 'cards', this.props.cardId];
      this.props.add
        ? this.props.handleCardAddDone(path, this.state.card)
        : this.props.handleCardEditDone(path, this.state.card);
    });

  handleDeleteConfirm = () => this.setState({ confirm: true });

  handleDeleteConfirmClose = () => this.setState({ confirm: false });

  handleDelete = () =>
    this.handleClose(() => {
      this.setState({ confirm: false }, () => {
        const path = ['items', this.props.groupId, 'cards', this.props.cardId];
        this.props.add
          ? this.props.handleCardAddDone(path)
          : this.props.handleCardEditDone(path);
      });
    });

  handleConfigChange = (path, value) => {
    let cardLcl = clone(this.state.card),
      defaultConfigLcl = clone(defaultConfig);

    const lastItem = path.pop();
    let secondLastItem = clone(path)
      .splice(4)
      .reduce((o, k) => (o[k] = o[k] || {}), cardLcl);
    secondLastItem[lastItem] = value;

    const defaultCard =
      defaultConfigLcl.items[0].cards.find(c => c.type === cardLcl.type) ||
      defaultConfigLcl.items[0].cards[0];
    if (lastItem === 'type') {
      // Delete any unused props and set the new props
      Object.keys(cardLcl).map(c =>
        !defaultCard[c] ? delete cardLcl[c] : (cardLcl[c] = defaultCard[c])
      );
      Object.keys(defaultCard).map(c =>
        !cardLcl[c] ? (cardLcl[c] = defaultCard[c]) : null
      );
    }
    // Fix type if not set
    if (!cardLcl.type) cardLcl.type = defaultConfigLcl.items[0].cards[0].type;

    this.setState({ defaultCard, card: cardLcl });
  };

  render() {
    const {
      classes,
      fullScreen,
      add,
      config,
      mainTheme,
      haUrl,
      haConfig,
      entities,
      groupId,
      cardId,
      max,
      movePosition
    } = this.props;
    const { open, defaultCard, card, confirm } = this.state;
    if (!open) return null;

    return (
      <Dialog
        className={classes.dialog}
        open={open}
        fullScreen={fullScreen}
        maxWidth="xl"
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title" className={classes.title}>
          {add ? 'Add' : 'Edit'} Card
        </DialogTitle>
        <div className={classes.root}>
          <Grid
            className={classes.container}
            container
            direction="row"
            justify="space-between"
            alignItems="center">
            <Hidden mdDown>
              <Grid className={classes.cardContainer} item xs>
                <Grid container justify="center" alignItems="center">
                  <CardBase
                    className={classes.card}
                    config={config}
                    editing
                    handleCardEdit={() => null}
                    handleCardAdd={() => null}
                    theme={mainTheme}
                    haUrl={haUrl}
                    haConfig={haConfig}
                    entities={entities}
                    groupId={groupId}
                    cardId={cardId}
                    card={card}
                    handleChange={() => null}
                  />
                </Grid>
              </Grid>
            </Hidden>
            <DialogContent className={classes.dialogContent}>
              <Grid className={classes.items} container direction="column">
                <Item
                  invisible
                  objKey={cardId}
                  defaultItem={defaultCard}
                  item={card}
                  defaultItemPath={['items', 0, 'cards']}
                  itemPath={['items', groupId, 'cards']}
                  entities={entities}
                  handleConfigChange={this.handleConfigChange}
                />
              </Grid>
            </DialogContent>
          </Grid>
        </div>
        <DialogActions className={classes.actions}>
          {!add && (
            <Button onClick={this.handleDeleteConfirm} color="primary">
              Delete
            </Button>
          )}
          <div className={classes.fill} />
          {!add && (
            <IconButton
              color="primary"
              disabled={cardId < 1}
              onClick={() =>
                movePosition(['items', groupId, 'cards', cardId], cardId - 1)
              }>
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
          )}
          {!add && (
            <IconButton
              color="primary"
              disabled={cardId === max}
              onClick={() =>
                movePosition(['items', groupId, 'cards', cardId], cardId + 1)
              }>
              <ArrowDownwardsIcon fontSize="small" />
            </IconButton>
          )}
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary">
            {add ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
        {confirm && (
          <ConfirmDialog
            text="Do you want to delete this card?"
            handleClose={this.handleDeleteConfirmClose}
            handleConfirm={this.handleDelete}
          />
        )}
      </Dialog>
    );
  }
}

EditCard.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool.isRequired,
  mainTheme: PropTypes.object.isRequired,
  haUrl: PropTypes.string.isRequired,
  entities: PropTypes.array.isRequired,
  groupId: PropTypes.number.isRequired,
  cardId: PropTypes.number.isRequired,
  haConfig: PropTypes.object,
  max: PropTypes.number,
  card: PropTypes.object,
  add: PropTypes.bool,
  handleCardAddDone: PropTypes.func,
  handleCardEditDone: PropTypes.func,
  movePosition: PropTypes.func
};

export default compose(
  withMobileDialog(),
  withStyles(styles)
)(EditCard);
