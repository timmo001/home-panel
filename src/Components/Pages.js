import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const styles = theme => ({

});

class Page extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => this.setState({ value }, () =>
    this.props.handlePageChange(this.state.value + 1));

  render() {
    const { classes, pages } = this.props;
    const { value } = this.state;

    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.root}>
        {pages.map((page, x) => {
          return <BottomNavigationAction
            key={x}
            label={page.name}
            icon={page.icon && <i className={classnames('mdi', `mdi-${page.icon}`, classes.icon)} />} />
        })}
      </BottomNavigation>
    );
  }
}

Page.propTypes = {
  classes: PropTypes.object.isRequired,
  pages: PropTypes.array.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Page);
