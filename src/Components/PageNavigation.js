import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Slide from '@material-ui/core/Slide';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  navigation: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: '0.94',
    background: theme.palette.backgrounds.navigation,
  },
  iconButton: {
    width: 48,
    height: 48,
    marginTop: 5
  }
});

class PageNavigation extends React.PureComponent {
  state = {
    value: 0,
    over: false,
  };

  handleChange = (_event, value) => value < this.props.pages.length &&
    this.setState({ value }, () =>
      this.props.handlePageChange(this.state.value + 1));

  handleButtonPress = (id, page) => {
    if (this.props.editing)
      this.buttonPressTimer = setTimeout(() => this.props.handlePageEdit(id, page), 1000);
  };

  handleButtonRelease = () => clearTimeout(this.buttonPressTimer);

  render() {
    const { classes, editing, handlePageAdd,
      pages, moved, over, handleMouseOver, handleMouseLeave } = this.props;
    const { value } = this.state;

    return (
      <Slide direction="up" in={editing || moved || over} mountOnEnter unmountOnExit>
        <BottomNavigation
          className={classes.navigation}
          showLabels
          value={value}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onChange={this.handleChange}>
          {pages.map((page, x) =>
            page && page.name && page.icon &&
            <BottomNavigationAction
              key={x}
              label={page.name}
              onTouchStart={() => this.handleButtonPress(x, { name: page.name, icon: page.icon })}
              onTouchEnd={this.handleButtonRelease}
              onMouseDown={() => this.handleButtonPress(x, { name: page.name, icon: page.icon })}
              onMouseUp={this.handleButtonRelease}
              onMouseLeave={this.handleButtonRelease}
              icon={page.icon && <span className={classnames('mdi', `mdi-${page.icon}`, classes.icon)} />} />
          )}
          {editing &&
            <BottomNavigationAction
              onClick={handlePageAdd}
              icon={<AddIcon />} />
          }
        </BottomNavigation>
      </Slide>
    );
  }
}

PageNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  handlePageAdd: PropTypes.func.isRequired,
  handlePageEdit: PropTypes.func.isRequired,
  pages: PropTypes.array.isRequired,
  moved: PropTypes.bool.isRequired,
  over: PropTypes.bool.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(PageNavigation);
