import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Slide from '@material-ui/core/Slide';

const styles = theme => ({
  navigation: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: '0.94',
    background: theme.palette.backgrounds.navigation,
  }
});

class PageNavigation extends React.Component {
  state = {
    value: 0,
    over: false,
  };

  handleChange = (_event, value) => this.setState({ value }, () =>
    this.props.handlePageChange(this.state.value + 1));

  render() {
    const { classes, pages, moved, over, handleMouseOver, handleMouseLeave } = this.props;
    const { value } = this.state;

    return (
      <Slide direction="up" in={moved || over} mountOnEnter unmountOnExit>
        <BottomNavigation
          className={classes.navigation}
          showLabels
          value={value}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onChange={this.handleChange}>
          {pages.map((page, x) => {
            return <BottomNavigationAction
              key={x}
              label={page.name}
              icon={page.icon && <i className={classnames('mdi', `mdi-${page.icon}`, classes.icon)} />} />
          })}
        </BottomNavigation>
      </Slide>
    );
  }
}

PageNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
  editing: PropTypes.bool.isRequired,
  pages: PropTypes.array.isRequired,
  moved: PropTypes.bool.isRequired,
  over: PropTypes.bool.isRequired,
  handleMouseOver: PropTypes.func.isRequired,
  handleMouseLeave: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(PageNavigation);
