import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Header from './Header';
import Page from './Cards/Page';
import PageNavigation from './PageNavigation';
import Radio from './Radio/Radio';
import EditCard from './EditConfig/EditCard';
import EditPage from './EditConfig/EditPage';
import EditGroup from './EditConfig/EditGroup';
import EditConfig from './EditConfig/EditConfig';
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
    radioShown: false,
    editing: false,
    addingPage: false,
    currentPage: 0
  };

  componentDidMount = () => {
    this.props.setTheme();
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

  handleRadioShow = () => this.setState({ radioShown: true });

  handleRadioHide = () => this.setState({ radioShown: false });

  handleRadioToggle = () =>
    this.setState({ radioShown: !this.state.radioShown });

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

  handleConfigChange = (path, value) => {
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
    this.props.handleConfigChange(config);
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

  handleCardEdit = (groupId, cardId, card) => {
    this.setState({ editingCard: { groupId, cardId, card: clone(card) } });
  };

  handlePageAdd = () => {
    this.setState({ addingPage: true });
  };

  handlePageEdit = (id, page) => {
    this.setState({ editingPage: { id, page: clone(page) } });
  };

  handleGroupAdd = (pageId, groupId) => {
    let group = clone(defaultConfig).items[0];
    group.page = pageId;
    this.setState({ addingGroup: { groupId, group } });
  };

  handleGroupEdit = (groupId, group) => {
    this.setState({ editingGroup: { groupId, group: clone(group) } });
  };

  handleEditConfig = path => {
    this.setState({
      editingItem: { path }
    });
  };

  handleCardAddDone = (path, card) => {
    path && this.handleConfigChange(path, clone(card));
    this.setState({ addingCard: undefined });
  };

  handleCardEditDone = (path, card) => {
    path && this.handleConfigChange(path, clone(card));
    this.setState({ editingCard: undefined });
  };

  handlePageAddDone = (path, page) => {
    path && this.handleConfigChange(path, clone(page));
    this.setState({ addingPage: undefined });
  };

  handlePageEditDone = (path, page) => {
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
        this.props.handleConfigChange(config);
      } else this.handleConfigChange(path, clone(page));
    this.setState({ editingPage: undefined });
  };

  handleGroupAddDone = (path, group) => {
    path && this.handleConfigChange(path, clone(group));
    this.setState({ addingGroup: undefined });
  };

  handleGroupEditDone = (path, group) => {
    path && this.handleConfigChange(path, clone(group));
    this.setState({ editingGroup: undefined });
  };

  handleItemEditDone = config => {
    config && this.handleConfigChange([], clone(config));
    this.setState({ editingItem: undefined });
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
      radioShown,
      currentPage,
      editing,
      addingCard,
      editingCard,
      addingPage,
      editingPage,
      addingGroup,
      editingGroup,
      editingItem
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
          handleRadioToggle={this.handleRadioToggle}
          handleLogOut={this.handleLogOut}
          handleRadioHide={this.handleRadioHide}
          handleConfigUI={this.handleConfigUI}
          handleEditConfig={this.handleEditConfig}
        />
        <div
          className={classes.pageContainer}
          onClick={this.handleRadioHide}
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
        <Radio show={radioShown} handleRadioHide={this.handleRadioHide} />
        {addingCard && (
          <EditCard
            config={config}
            add
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
            handleCardEditDone={this.handleCardEditDone}
          />
        )}
        {addingPage && (
          <EditPage
            config={config}
            add
            id={pages.length}
            page={clone(defaultConfig).pages[0]}
            handlePageAddDone={this.handlePageAddDone}
          />
        )}
        {editingPage && (
          <EditPage
            config={config}
            id={editingPage.id}
            page={editingPage.page}
            handlePageEditDone={this.handlePageEditDone}
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
            group={editingGroup.group}
            handleGroupEditDone={this.handleGroupEditDone}
          />
        )}
        {editingItem && (
          <EditConfig
            config={config}
            path={editingItem.path}
            handleItemEditDone={this.handleItemEditDone}
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
