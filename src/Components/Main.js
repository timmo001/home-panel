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
import defaultConfig from './EditConfig/defaultConfig.json';
import isObject from './Common/isObject';
import clone from './Common/clone';

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
    currentPage: 0,
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
    }
  };

  onMouseOverHandler = () => this.setState({ over: true });

  onMouseLeaveHandler = () => this.setState({ over: false });

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = value => this.setState({ anchorEl: null }, () => {
    this.props.setTheme(value);
  });

  handleButtonRelease = () => clearTimeout(this.buttonPressTimer);

  handleRadioShow = () => this.setState({ radioShown: true });

  handleRadioHide = () => this.setState({ radioShown: false });

  handleRadioToggle = () => this.setState({ radioShown: !this.state.radioShown });

  handleLogOut = () => {
    localStorage.removeItem('should_login');
    localStorage.removeItem('hass_tokens');
    localStorage.removeItem('username');
    sessionStorage.removeItem('password');
    localStorage.setItem('been_here', true);
    window.location.reload(true);
  };

  handlePageChange = pageNo => this.setState({ currentPage: pageNo });

  handleEditConfig = () =>
    this.state.editing ?
      this.setState({ editing: false })
      : this.setState({ editing: true });

  handleEditingComplete = () => this.setState({ editing: false });

  handleConfigChange = (path, value) => {
    console.log(clone(path), clone(value));
    let config = clone(this.props.config);
    // Set the new value
    const lastItem = path.pop();
    let secondLastItem = path.reduce((o, k) => o[k] = o[k] || {}, config);
    if (value === undefined)
      secondLastItem.splice(secondLastItem.indexOf(lastItem));
    else
      if (isObject(value)) {
        const newValue = JSON.parse(JSON.stringify(value));
        if (!secondLastItem[lastItem]) secondLastItem[lastItem] = [];
        secondLastItem[lastItem] = newValue;
      } else secondLastItem[lastItem] = value;
    this.props.handleConfigChange(config);
  };

  handleCardAdd = (groupId, cardId) =>
    this.setState({
      addingCard: { groupId, cardId, card: clone(defaultConfig.items[0].cards[0]) }
    });

  handleCardEdit = (groupId, cardId, card) =>
    this.setState({ editingCard: { groupId, cardId, card: clone(card) } });

  handlePageAdd = () => this.setState({ addingPage: true });

  handlePageEdit = (id, page) => this.setState({ editingPage: { id, page: clone(page) } });

  handleGroupAdd = (groupId) =>
    this.setState({ addingGroup: { groupId, group: clone(defaultConfig.items[0]) } });

  handleGroupEdit = (groupId, group) =>
    this.setState({ editingGroup: { groupId, group: clone(group) } });

  handleCardAddDone = (path, card) => {
    path && this.handleConfigChange(path, clone(card));
    this.setState({ addingCard: undefined });
  };

  handleCardEditDone = (path, card) => {
    path && this.handleConfigChange(path, clone(card));
    this.setState({ editingCard: undefined });
  };

  handlePageAddDone = (id, page) => {
    id && this.handleConfigChange(['pages', id], clone(page));
    this.setState({ addingPage: undefined });
  };

  handlePageEditDone = (id, page) => {
    id && this.handleConfigChange(['pages', id], clone(page));
    this.setState({ editingPage: undefined });
  };

  handleGroupAddDone = (id, group) => {
    id && this.handleConfigChange(['items', id], clone(group));
    this.setState({ addingGroup: undefined });
  };

  handleGroupEditDone = (id, group) => {
    id && this.handleConfigChange(['items', id], clone(group));
    this.setState({ editingGroup: undefined });
  };

  render() {
    const { classes, haUrl, haConfig, entities, config, themes,
      theme, handleChange } = this.props;
    const { moved, over, radioShown, currentPage, editing,
      addingCard, editingCard, addingPage, editingPage,
      addingGroup, editingGroup } = this.state;
    const pages = config.pages && config.pages.length > 1 && config.pages;
    const page = pages ? { id: currentPage === 0 ? 1 : currentPage, ...pages[currentPage] } : { id: 1, name: "Home", icon: "home" };

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
          handleEditConfig={this.handleEditConfig} />
        <div className={classes.pageContainer} onClick={this.handleRadioHide} style={{
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
            handleChange={handleChange} />
        </div>
        {pages &&
          <PageNavigation
            editing={editing}
            handlePageAdd={this.handlePageAdd}
            handlePageEdit={this.handlePageEdit}
            pages={pages}
            moved={moved}
            over={over}
            handleMouseOver={this.onMouseMoveHandler}
            handleMouseLeave={this.onMouseLeaveHandler}
            handlePageChange={this.handlePageChange} />
        }
        <Radio
          show={radioShown}
          apiUrl={this.props.apiUrl}
          handleRadioHide={this.handleRadioHide} />
        {addingCard &&
          <EditCard
            config={config}
            add
            card={addingCard.card}
            theme={theme}
            haUrl={haUrl}
            haConfig={haConfig}
            entities={entities}
            groupId={addingCard.groupId}
            cardId={addingCard.cardId}
            handleCardAddDone={this.handleCardAddDone} />
        }
        {editingCard &&
          <EditCard
            config={config}
            card={editingCard.card}
            theme={theme}
            haUrl={haUrl}
            haConfig={haConfig}
            entities={entities}
            groupId={editingCard.groupId}
            cardId={editingCard.cardId}
            handleCardEditDone={this.handleCardEditDone} />
        }
        {addingPage &&
          <EditPage
            config={config}
            add
            id={pages.length + 1}
            page={defaultConfig.pages[0]}
            handlePageAddDone={this.handlePageAddDone} />
        }
        {editingPage &&
          <EditPage
            config={config}
            id={editingPage.id}
            page={editingPage.page}
            handlePageEditDone={this.handlePageEditDone} />
        }
        {addingGroup &&
          <EditGroup
            add
            config={config}
            id={addingGroup.groupId}
            group={addingGroup.group}
            handleGroupAddDone={this.handleGroupAddDone} />
        }
        {editingGroup &&
          <EditGroup
            config={config}
            id={editingGroup.groupId}
            group={editingGroup.group}
            handleGroupEditDone={this.handleGroupEditDone} />
        }
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
  apiUrl: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleConfigChange: PropTypes.func.isRequired,
  saveTokens: PropTypes.func.isRequired,
};

export default withStyles(styles)(Main);
