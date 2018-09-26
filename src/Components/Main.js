import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from './Header';
import Page from './Cards/Page';
import PageNavigation from './PageNavigation';
import Radio from './Radio/Radio';
import EditConfig from './EditConfig/EditConfig';

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%'
  },
  pageContainer: {
    height: 'calc(100% - 24px)',
    overflowY: 'auto',
    transition: 'height 225ms cubic-bezier(0, 0, 0.2, 1) 0ms'
  },
});

var hoverTimeout;

class Main extends React.Component {
  state = {
    moved: false,
    over: false,
    hovered: false,
    radioShown: false,
    editConfig: false,
    currentPage: 0,
  };

  componentDidMount = () => this.props.setTheme();

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = (themeId) => {
    this.setState({ anchorEl: null });
    this.props.setTheme(themeId);
  };

  onMouseMoveHandler = () => {
    clearTimeout(hoverTimeout);
    if (!this.state.over) {
      this.setState({ moved: true }, () => {
        hoverTimeout = setTimeout(() => {
          this.setState({ moved: false });
        }, 5000);
      });
    }
  };

  onMouseOverHandler = () => this.setState({ over: true });

  onMouseLeaveHandler = () => this.setState({ over: false });

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = (value) => this.setState({ anchorEl: null }, () => {
    this.props.setTheme(value);
  });

  handleButtonRelease = () => clearTimeout(this.buttonPressTimer);

  handleRadioShow = () => this.setState({ radioShown: true });

  handleRadioHide = () => this.setState({ radioShown: false });

  handleRadioToggle = () => this.setState({ radioShown: !this.state.radioShown });

  handleLogOut = () => {
    if (process.env.REACT_APP_OVERRIDE_API_URL) localStorage.removeItem('hass_url');
    sessionStorage.removeItem('password');
    this.props.saveTokens(null);
    window.location.reload(true);
  };

  handlePageChange = (pageNo) => this.setState({ currentPage: pageNo });

  handleEditConfig = () => this.setState({ editConfig: true });

  handleEditConfigClose = () => this.setState({ editConfig: false });

  render() {
    const { classes, entities, config, themes, theme, handleChange } = this.props;
    const { moved, over, radioShown, currentPage, editConfig } = this.state;
    const pages = config.pages ? config.pages : [{ id: 1, name: "Home", icon: "home" }];
    const page = pages ? { id: currentPage === 0 ? 1 : currentPage, ...pages[currentPage] } : { id: 1, name: "Home", icon: "home" };
    return (
      <div className={classes.root} onMouseMove={this.onMouseMoveHandler}>
        <Header
          config={config}
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
          height: moved || over ? 'calc(100% - 58px)' : 'inherit'
        }}>
          <Page config={config} entities={entities} theme={theme} page={{ ...page }} handleChange={handleChange} />
        </div>
        <PageNavigation
          pages={pages}
          moved={moved}
          over={over}
          handleMouseOver={this.onMouseMoveHandler}
          handleMouseLeave={this.onMouseLeaveHandler}
          handlePageChange={this.handlePageChange} />
        <Radio
          show={radioShown}
          apiUrl={this.props.apiUrl}
          handleRadioHide={this.handleRadioHide} />
        <EditConfig
          open={editConfig}
          config={config}
          username={this.props.username}
          password={this.props.password}
          apiUrl={this.props.apiUrl}
          handleClose={this.handleEditConfigClose} />
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
  entities: PropTypes.array.isRequired,
  apiUrl: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  saveTokens: PropTypes.func.isRequired,
};

export default withStyles(styles)(Main);