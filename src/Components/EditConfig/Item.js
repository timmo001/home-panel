import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import Add from '@material-ui/icons/Add';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Delete from '@material-ui/icons/Delete';
import isObject from '../Common/isObject';
import properCase from '../Common/properCase';
import Input from './Input';
import NextItem from './Item';

const styles = theme => ({
  root: {
    padding: '8px 8px 2px 16px',
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
  addIcon: {
    flex: '1 1 auto'
  },
  iconButton: {
    height: 32,
    width: 32,
    marginRight: 16,
  },
  icon: {
    height: 22,
    width: 22,
    transform: 'translateY(-8px)'
  }
});

class Item extends React.Component {
  state = {
    open: this.props.open !== undefined ? this.props.open :
      this.props.itemPath.length < 2 ||
      this.props.itemPath.length > 2 ||
      Array.isArray(this.props.item)
  };

  handleClick = () => this.setState(state => ({ open: !state.open }));

  render() {
    const { classes, objKey, defaultItem, item, defaultItemPath, itemPath, canDelete, handleConfigChange } = this.props;
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
            {JSON.stringify(item, null, 2)}
          </Typography>
        }
        {canDelete &&
          <IconButton
            className={classes.iconButton}
            aria-label="Delete"
            onClick={() => handleConfigChange(itemPath, undefined)}>
            <Delete className={classes.icon} />
          </IconButton>
        }
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>;

    return (
      <div className={classes.root}>
        {Array.isArray(defaultItem) ?
          <div>
            {dropdown}
            <Divider />
            <Collapse in={open}>
              {item && item.map((ai, ax) => {
                return <NextItem
                  key={ax}
                  open={false}
                  canDelete={true}
                  objKey={ax}
                  defaultItem={defaultItem[objKey === 'cards' ?
                    ai.type === 'link' ? 1 :
                      ai.type === 'camera' ? 2 :
                        ai.type === 'iframe' ? 3 :
                          0 : 0]}
                  item={ai}
                  defaultItemPath={defaultItemPath.concat([objKey === 'cards' ?
                    ai.type === 'link' ? 1 :
                      ai.type === 'camera' ? 2 :
                        ai.type === 'iframe' ? 3 :
                          0 : 0])}
                  itemPath={itemPath.concat([ax])}
                  handleConfigChange={handleConfigChange} />
              })}
              <ListItem className={classes.root}>
                <Button
                  className={classes.addIcon}
                  mini
                  aria-label="Add"
                  onClick={() => handleConfigChange(itemPath, defaultItem[0])}>
                  <Add />
                </Button>
              </ListItem>
            </Collapse>
          </div>
          :
          isObject(defaultItem) ?
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
                      item={item[i] !== undefined ? item[i] : defaultItem[i]}
                      defaultItemPath={defaultItemPath.concat([i])}
                      itemPath={itemPath.concat([i])}
                      handleConfigChange={handleConfigChange} />
                  })
                  :
                  <Typography color="error" variant="subheading">
                    No default config set for {JSON.stringify(item)}.<br />
                    Please report this error to Git repository&lsquo;s issue tracker including a screenshot of this item&lsquo;s location.
                  </Typography>
                }
              </Collapse>
            </div>
            :
            <Input
              name={String(objKey)}
              defaultValue={defaultItem}
              value={item}
              defaultItemPath={defaultItemPath}
              itemPath={itemPath}
              handleConfigChange={handleConfigChange} />
        }
      </div>
    );
  }
}

Item.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultItem: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  item: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  objKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  defaultItemPath: PropTypes.array.isRequired,
  itemPath: PropTypes.array.isRequired,
  open: PropTypes.bool,
  canDelete: PropTypes.bool,
  handleConfigChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Item);
