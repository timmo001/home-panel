import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
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
    paddingTop: theme.spacing.unit * 2
  },
  dropdownSubText: {
    margin: '0 16px',
    flex: '1 1 auto',
    fontSize: '1.0rem'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing.unit
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

class Item extends React.PureComponent {
  render() {
    let {
      classes,
      objKey,
      defaultItem,
      item,
      defaultItemPath,
      itemPath,
      handleConfigChange
    } = this.props;

    console.log('');
    console.log('Item');
    console.log('objKey:', objKey);
    console.log('defaultItemPath:', defaultItemPath);
    console.log('itemPath:', itemPath);
    console.log('defaultItem:', defaultItem);
    console.log('item:', item);

    defaultItemPath = defaultItemPath.concat(
      typeof objKey === 'number' && objKey > 0 ? 0 : objKey
    );
    itemPath = itemPath.concat(objKey);

    if (isObject(defaultItem)) {
      return (
        <div className={classes.root}>
          <Typography className={classes.dropdownText} variant="h6">
            {objKey && properCase(objKey)}
          </Typography>
          <Divider />
          <div className={classes.container}>
            {defaultItem ? (
              Object.keys(defaultItem).map((i, x) => {
                return (
                  <NextItem
                    key={x}
                    objKey={i}
                    defaultItem={defaultItem[i]}
                    item={item[i] !== undefined ? item[i] : defaultItem[i]}
                    defaultItemPath={defaultItemPath}
                    itemPath={itemPath}
                    handleConfigChange={handleConfigChange}
                  />
                );
              })
            ) : (
              <Typography color="error" variant="subtitle1">
                No default config set for {JSON.stringify(item)}.<br />
                Please report this error to Git repository&lsquo;s issue tracker
                including a screenshot of this item&lsquo;s location.
              </Typography>
            )}
          </div>
        </div>
      );
    } else if (Array.isArray(defaultItem))
      return (
        <div className={classes.root}>
          <Typography className={classes.dropdownText} variant="h6">
            {objKey && properCase(objKey)}
          </Typography>
          <Divider />
          <div className={classes.container}>
            {item.map((i, x) => {
              // console.log('Array - defaultItemPath:', defaultItemPath);
              return (
                <NextItem
                  key={x}
                  objKey={x}
                  defaultItem={defaultItem[0]}
                  item={i}
                  defaultItemPath={defaultItemPath}
                  itemPath={itemPath}
                  handleConfigChange={handleConfigChange}
                />
              );
            })}
          </div>
        </div>
      );
    else {
      return (
        <Input
          name={String(objKey)}
          defaultValue={defaultItem}
          value={item}
          defaultItemPath={defaultItemPath}
          itemPath={itemPath}
          handleConfigChange={handleConfigChange}
        />
      );
    }
  }
}

Item.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultItem: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  item: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  objKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultItemPath: PropTypes.array.isRequired,
  itemPath: PropTypes.array.isRequired,
  handleConfigChange: PropTypes.func.isRequired
};

export default withStyles(styles)(Item);
