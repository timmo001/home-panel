import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import AddIcon from '@material-ui/icons/Add';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import isObject from '../Common/isObject';
import properCase from '../Common/properCase';
import Input from './Input';
import NextItem from './Item';

const styles = theme => ({
  root: {
    padding: '8px 0 2px 16px',
    color: theme.palette.text.main
  },
  dropdown: {
    paddingLeft: theme.spacing.unit / 2
  },
  dropdownText: {
    flex: '1 0 auto'
  },
  dropdownSubText: {
    margin: '0 16px',
    flex: '1 1 auto',
    fontSize: '1.0rem'
  },
});

class SubItem extends React.Component {
  state = {
    open: this.props.open !== undefined ? this.props.open :
      this.props.itemPath.length < 2 ||
      this.props.itemPath.length > 2 ||
      Array.isArray(this.props.item)
  };

  handleClick = () => this.setState(state => ({ open: !state.open }));

  render() {
    const { classes, objKey, defaultItem, item, itemPath, handleConfigChange } = this.props;
    const { open } = this.state;

    const dropdown = itemPath.length === 1 ?
      <ListItem className={classes.dropdown}>
        <Typography className={classes.dropdownText} variant="title">
          {objKey && properCase(objKey)}
        </Typography>
      </ListItem>
      :
      <ListItem className={classes.dropdown} button onClick={this.handleClick}>
        <Typography className={classes.dropdownText} variant="title">
          {objKey && properCase(objKey)}
        </Typography>
        {!open &&
          <Typography className={classes.dropdownSubText} noWrap>
            {JSON.stringify(item)}
          </Typography>
        }
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

    return (
      <div className={classes.root}>
        {Array.isArray(item) ?
          <div>
            {dropdown}
            <Divider />
            <Collapse in={open}>
              {item.map((ai, ax) => {
                return <NextItem
                  key={ax}
                  open={false}
                  objKey={ax}
                  defaultItem={defaultItem[objKey === 'cards' ?
                    ai.type === 'link' ? 1 :
                      ai.type === 'camera' ? 2 :
                        ai.type === 'iframe' ? 3 :
                          0 : 0]}
                  item={ai}
                  itemPath={itemPath.concat([ax])}
                  handleConfigChange={handleConfigChange} />
              })}
              <Button variant="fab" mini color="primary" aria-label="Add">
                <AddIcon />
              </Button>
            </Collapse>
          </div>
          :
          isObject(item) ?
            <div>
              {dropdown}
              <Divider />
              <Collapse in={open}>
                {defaultItem ?
                  Object.keys(defaultItem).map((i, x) => {
                    return <NextItem
                      key={x}
                      objKey={i}
                      defaultItem={defaultItem[i]}
                      item={item[i]}
                      itemPath={itemPath.concat([i])}
                      handleConfigChange={handleConfigChange} />
                  })
                  :
                  <Typography color="error" variant="subheading">
                    No default config set for {JSON.stringify(item)}.<br />
                    Please report this error to Git repository's issue tracker including a screenshot of this item's location.
                </Typography>
                }
              </Collapse>
            </div>
            :
            <Input
              name={objKey}
              defaultValue={defaultItem}
              value={item}
              itemPath={itemPath}
              handleConfigChange={handleConfigChange} />
        }
      </div>
    );
  }
}

SubItem.propTypes = {
  classes: PropTypes.object.isRequired,
  itemPath: PropTypes.array.isRequired,
  handleConfigChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(SubItem);
