import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import grid from '../Common/Style/grid';
import card from '../Common/Style/card';

const styles = theme => ({
  ...grid(theme),
  ...card(theme),
});

class AddGroup extends React.PureComponent {
  render() {
    const { classes, handleGroupAdd, groupId } = this.props;

    return (
      <Grid className={classes.group} style={{ '--width': 2 }} item>
        <ButtonBase
          className={classes.groupButton}
          style={{ width: 300 }}
          focusRipple
          onClick={() => handleGroupAdd(groupId)}>
          <span className={classnames('mdi', 'mdi-plus', classes.icon)} />
        </ButtonBase>
      </Grid>
    );
  }
}

AddGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  handleGroupAdd: PropTypes.func.isRequired,
  groupId: PropTypes.number.isRequired
};

export default withStyles(styles)(AddGroup);
