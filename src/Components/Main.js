import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import arrayMove from 'array-move';
import Header from './Header';
import Page from './Cards/Page';
import PageNavigation from './PageNavigation';
import EditCard from './EditConfig/EditCard';
import EditPage from './EditConfig/EditPage';
import EditGroup from './EditConfig/EditGroup';
import EditConfig from './EditConfig/EditConfig';
import RawEditor from './EditConfig/RawEditor';
import dc from './EditConfig/defaultConfig.json';
import isObject from './Common/isObject';
import clone from './Common/clone';

const defaultConfig = clone(dc);

const styles = () => ({
  root: {
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%'
  },
  pageContainer: {
    height: '100%',
    overflowY: 'auto',
    transition: 'height 225ms cubic-bezier(0, 0, 0.2, 1) 0ms'
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  }
});

var hoverTimeout;

class Main extends React.PureComponent {
  state = {
    moved: true,
    over: false,
    hovered: false,
    editing: false,
    addingPage: false,
    currentPage: 0
  };

  componentDidMount = () => {
    this.onMouseMoveHandler();
  };

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = themeId => {
    this.setState({ anchorEl: null });
    this.props.setTheme(themeId);
  };

  onMouseMoveHandler = () => {
    if (!this.state.editing) {
      clearTimeout(hoverTimeout);
      if (!this.state.over) {
        this.setState({ moved: true }, () => {
          hoverTimeout = setTimeout(() => {
            this.setState({ moved: false });
          }, 5000);
        });
      }
    } else if (!this.state.over) this.setState({ moved: true, over: true });
  };

  onMouseOverHandler = () => this.setState({ over: true });

  onMouseLeaveHandler = () => this.setState({ over: false });

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = value =>
    this.setState({ anchorEl: null }, () => {
      this.props.setTheme(value);
    });

  handleButtonRelease = () => clearTimeout(this.buttonPressTimer);

  handleLogOut = () => {
    localStorage.removeItem('hass_tokens');
    localStorage.setItem('been_here', true);
    this.props.logout();
  };

  handlePageChange = pageNo => this.setState({ currentPage: pageNo });

  handleConfigUI = () =>
    this.state.editing
      ? this.setState({ editing: false })
      : this.setState({ editing: true });

  handleConfigChange = (path, value, cb = undefined) => {
    let config = clone(this.props.config);
    if (path.length > 0) {
      // Set the new value
      const lastItem = path.pop();
      let secondLastItem = path.reduce((o, k) => (o[k] = o[k] || {}), config);
      if (value === undefined) {
        secondLastItem.splice(lastItem, 1);
      } else if (isObject(value)) {
        const newValue = JSON.parse(JSON.stringify(value));
        if (!secondLastItem[lastItem]) secondLastItem[lastItem] = [];
        secondLastItem[lastItem] = newValue;
      } else secondLastItem[lastItem] = value;
    } else config = value;
    this.props.handleConfigChange(config, cb);
  };

  handleCardAdd = (groupId, cardId) => {
    this.setState({
      addingCard: {
        groupId,
        cardId,
        card: clone(defaultConfig).items[0].cards[0]
      }
    });
  };

  handleCardEdit = (groupId, cardId, card) =>
    this.setState({
      editingCard: {
        groupId,
        cardId,
        max: this.props.config.items[groupId].cards.length - 1,
        card: clone(card)
      }
    });

  handlePageAdd = () => this.setState({ addingPage: true });

  handlePageEdit = (id, page) =>
    this.setState({
      editingPage: {
        id,
        max: this.props.config.pages.length - 1,
        page: clone(page)
      }
    });

  handleGroupAdd = (pageId, groupId) => {
    let group = clone(defaultConfig).items[0];
    group.page = pageId;
    this.setState({ addingGroup: { groupId, group } });
  };

  handleGroupEdit = (groupId, group) => {
    let groupKey = 0,
      max = 0;
    this.props.config.items.map(i => {
      if (i.page === this.state.currentPage + 1) max += 1;
      if (i === group) groupKey = clone(max);
      return i;
    });
    this.setState({
      editingGroup: { groupId, groupKey, max, group: clone(group) }
    });
  };

  handleEditConfig = path => {
    this.setState({
      editingItem: { path }
    });
  };

  handleEditConfigRaw = () => this.setState({ editingRaw: true });

  handleCardAddDone = (path, card) => {
    path && this.handleConfigChange(path, clone(card));
    this.setState({ addingCard: undefined });
  };

  handleCardEditDone = (path, card, cb) => {
    path && this.handleConfigChange(path, clone(card), cb);
    this.setState({ editingCard: undefined });
  };

  handlePageAddDone = (path, page) => {
    path && this.handleConfigChange(path, clone(page));
    this.setState({ addingPage: undefined });
  };

  handlePageEditDone = (path, page, cb) => {
    let config = clone(this.props.config);
    if (path)
      if (!page) {
        const pageId = clone(path).pop() + 1;
        config.pages.splice(pageId - 1, 1);
        clone(config).items.map((i, x) => {
          if (i.page === pageId) config.items.splice(x, 1);
          else if (i.page > pageId) config.items[x].page = i.page - 1;
          return config.items[x];
        });
        this.props.handleConfigChange(config, cb);
      } else this.handleConfigChange(path, clone(page), cb);
    this.setState({ editingPage: undefined });
  };

  handleGroupAddDone = (path, group) => {
    path && this.handleConfigChange(path, clone(group));
    this.setState({ addingGroup: undefined });
  };

  handleGroupEditDone = (path, group, cb) => {
    path && this.handleConfigChange(path, clone(group), cb);
    this.setState({ editingGroup: undefined });
  };

  handleItemEditDone = config => {
    config && this.handleConfigChange([], clone(config));
    this.setState({ editingItem: undefined });
  };

  handleRawEditDone = config => {
    config && this.handleConfigChange([], clone(config));
    this.setState({ editingRaw: undefined });
  };

  handleMovePosition = (path, newPos) => {
    let config = clone(this.props.config);
    const lastItem = path.pop();
    let secondLastItem = path.reduce((o, k) => (o[k] = o[k] || {}), config);
    arrayMove.mutate(secondLastItem, lastItem, newPos);
    this.props.handleConfigChange(config);
    this.setState({
      editingGroup: undefined,
      editingCard: undefined
    });
  };

  handlePageMovePosition = (path, newPos) => {
    let config = clone(this.props.config);
    let lastItem = path.pop();
    let secondLastItem = path.reduce((o, k) => (o[k] = o[k] || {}), config);
    arrayMove.mutate(secondLastItem, lastItem, newPos);

    lastItem += 1;
    newPos += 1;
    // Move groups in previous id to new id and vice-versa
    config.items = config.items.map(i => {
      if (i.page === lastItem) i.page = newPos;
      else if (i.page === newPos) i.page = lastItem;
      return i;
    });

    this.props.handleConfigChange(config);
    this.setState({ editingPage: undefined });
  };

  render() {
    const {
      classes,
      haUrl,
      haConfig,
      entities,
      config,
      themes,
      theme,
      handleChange
    } = this.props;
    const {
      moved,
      over,
      currentPage,
      editing,
      addingCard,
      editingCard,
      addingPage,
      editingPage,
      addingGroup,
      editingGroup,
      editingItem,
      editingRaw
    } = this.state;
    const pages = config.pages
      ? config.pages
      : [{ id: 1, name: 'Home', icon: 'home' }];
    const page = {
      id: currentPage === 0 ? 1 : currentPage,
      ...pages[currentPage]
    };

    return (
      <div className={classes.root} onMouseMove={this.onMouseMoveHandler}>
        <Header
          config={config}
          editing={editing}
          entities={entities}
          themes={themes}
          theme={theme}
          moved={moved}
          over={over}
          handleMouseOver={this.onMouseMoveHandler}
          handleMouseLeave={this.onMouseLeaveHandler}
          setTheme={this.props.setTheme}
          handleLogOut={this.handleLogOut}
          handleConfigUI={this.handleConfigUI}
          handleEditConfig={this.handleEditConfig}
          handleEditConfigRaw={this.handleEditConfigRaw}
        />
        <div
          className={classes.pageContainer}
          style={{
            height: pages && (moved || over) ? 'calc(100% - 72px)' : 'inherit'
          }}>
          <Page
            config={config}
            editing={editing}
            handleCardEdit={this.handleCardEdit}
            handleCardAdd={this.handleCardAdd}
            handleGroupAdd={this.handleGroupAdd}
            handleGroupEdit={this.handleGroupEdit}
            haUrl={haUrl}
            haConfig={haConfig}
            entities={entities}
            theme={theme}
            page={{ ...page }}
            handleChange={handleChange}
          />
        </div>
        {pages && (
          <PageNavigation
            editing={editing}
            handlePageAdd={this.handlePageAdd}
            handlePageEdit={this.handlePageEdit}
            pages={pages}
            moved={moved}
            over={over}
            handleMouseOver={this.onMouseMoveHandler}
            handleMouseLeave={this.onMouseLeaveHandler}
            handlePageChange={this.handlePageChange}
          />
        )}
        {addingCard && (
          <EditCard
            add
            config={config}
            card={addingCard.card}
            mainTheme={theme}
            haUrl={haUrl}
            haConfig={haConfig}
            entities={entities}
            groupId={addingCard.groupId}
            cardId={addingCard.cardId}
            handleCardAddDone={this.handleCardAddDone}
          />
        )}
        {editingCard && (
          <EditCard
            config={config}
            card={editingCard.card}
            mainTheme={theme}
            haUrl={haUrl}
            haConfig={haConfig}
            entities={entities}
            groupId={editingCard.groupId}
            cardId={editingCard.cardId}
            max={editingCard.max}
            handleCardEditDone={this.handleCardEditDone}
            movePosition={this.handleMovePosition}
          />
        )}
        {addingPage && (
          <EditPage
            add
            config={config}
            id={pages.length}
            page={clone(defaultConfig).pages[0]}
            handlePageAddDone={this.handlePageAddDone}
          />
        )}
        {editingPage && (
          <EditPage
            config={config}
            id={editingPage.id}
            max={editingPage.max}
            page={editingPage.page}
            handlePageEditDone={this.handlePageEditDone}
            movePosition={this.handlePageMovePosition}
          />
        )}
        {addingGroup && (
          <EditGroup
            add
            config={config}
            id={addingGroup.groupId}
            group={addingGroup.group}
            handleGroupAddDone={this.handleGroupAddDone}
          />
        )}
        {editingGroup && (
          <EditGroup
            config={config}
            id={editingGroup.groupId}
            groupKey={editingGroup.groupKey}
            max={editingGroup.max}
            group={editingGroup.group}
            handleGroupEditDone={this.handleGroupEditDone}
            movePosition={this.handleMovePosition}
          />
        )}
        {editingItem && (
          <EditConfig
            config={config}
            path={editingItem.path}
            entities={entities}
            handleItemEditDone={this.handleItemEditDone}
          />
        )}
        {editingRaw && (
          <RawEditor
            config={config}
            handleRawEditDone={this.handleRawEditDone}
          />
        )}
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
  haUrl: PropTypes.string.isRequired,
  haConfig: PropTypes.object,
  entities: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleConfigChange: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  saveTokens: PropTypes.func.isRequired
};

export default withStyles(styles)(Main);
