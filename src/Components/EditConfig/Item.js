import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
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
    display: 'block',
    color: theme.palette.text.main
  },
  dropdown: {
    display: 'flex',
    width: '100%',
    padding: '6px 4px'
  },
  dropdownText: {
    overflow: 'visible'
  },
  dropdownSubText: {
    margin: '0 16px',
    flex: '1 1 auto',
    fontSize: '1.0rem'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 8px 2px 16px'
  },
  addIcon: {
    width: '100%',
    margin: '2px 0',
    padding: 8
  },
  iconButton: {
    height: 10,
    width: 10,
    marginRight: 16
  },
  icon: {
    height: 20,
    width: 20
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
      <ButtonBase className={classes.dropdown} focusRipple>
        <Typography className={classes.dropdownText} variant="h6">
          {objKey && properCase(objKey)}
        </Typography>
      </ButtonBase>
      :
      <ButtonBase className={classes.dropdown} onClick={this.handleClick} focusRipple>
        <Typography className={classes.dropdownText} variant="h6" noWrap>
          {objKey && properCase(objKey)}
        </Typography>
        <Typography className={classes.dropdownSubText} noWrap>
          {!open && JSON.stringify(item, null, 2)}
        </Typography>
        {canDelete &&
          <IconButton
            className={classes.iconButton}
            component={'span'}
            aria-label="Delete"
            onClick={() => handleConfigChange(itemPath, undefined)}>
            <Delete className={classes.icon} />
          </IconButton>
        }
        {open ? <ExpandLess /> : <ExpandMore />}
      </ButtonBase>;

    if (Array.isArray(defaultItem)) return (
      <div className={classes.root}>
        {dropdown}
        <Divider />
        <Collapse in={open}>
          <div className={classes.container}>
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
            <div className={classes.root}>
              <ButtonBase
                className={classes.addIcon}
                aria-label="Add"
                onClick={() => handleConfigChange(itemPath, defaultItem[0])}>
                <Add />
              </ButtonBase>
            </div>
          </div>
        </Collapse>
      </div>
    ); else if (isObject(defaultItem)) return (
      <div className={classes.root}>
        {dropdown}
        <Divider />
        <Collapse in={open}>
          <div className={classes.container}>
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
              <Typography color="error" variant="subtitle1">
                No default config set for {JSON.stringify(item)}.<br />
                Please report this error to Git repository&lsquo;s issue tracker including a screenshot of this item&lsquo;s location.
              </Typography>
            }
          </div>
        </Collapse>
      </div>
    ); else return (
      <Input
        name={String(objKey)}
        defaultValue={defaultItem}
        value={item}
        defaultItemPath={defaultItemPath}
        itemPath={itemPath}
        handleConfigChange={handleConfigChange} />
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
