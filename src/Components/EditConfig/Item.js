import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import isObject from '../Common/isObject';
import properCase from '../Common/properCase';
import Input from './Input';
import NextItem from './Item';

const styles = theme => ({
  root: {
    padding: '8px 0 2px 16px'
  }
});

class SubItem extends React.Component {

  render() {
    const { classes, objKey, defaultItem, item, handleChange } = this.props;

    return (
      <div className={classes.root}>
        {Array.isArray(item) ?
          <div>
            <Typography variant="title">{properCase(objKey)}</Typography>
            <Divider />
            {item.map((ai, ax) => {
              return (
                <div key={ax}>
                  {Object.keys(item).map((i, x) => {
                    return <NextItem
                      key={x}
                      defaultItem={defaultItem[i] ? defaultItem[i] : item[i]}
                      item={item[i]}
                      handleChange={handleChange} />
                  })}
                  <Divider />
                </div>
              );
            })}
          </div>
          :
          isObject(item) ?
            <div>
              <Typography variant="subheading">{properCase(objKey)}</Typography>
              <Divider />
              {Object.keys(item).map((i, x) => {
                return <NextItem
                  key={x}
                  objKey={i}
                  defaultItem={defaultItem[i] ? defaultItem[i] : item[i]}
                  item={item[i]}
                  handleChange={handleChange} />
              })}
            </div>
            :
            <Input
              name={properCase(objKey)}
              defaultValue={defaultItem ? defaultItem : ''}
              value={item ? item : defaultItem ? defaultItem : ''}
              handleChange={handleChange} />
        }
      </div>
    );
  }
}

SubItem.propTypes = {
  classes: PropTypes.object.isRequired,
  objKey: PropTypes.string,
  // defaultItem: PropTypes.oneOfType(
  //   PropTypes.array,
  //   PropTypes.object,
  //   PropTypes.string,
  //   PropTypes.number,
  //   PropTypes.bool
  // ),
  // item: PropTypes.oneOfType(
  //   PropTypes.array,
  //   PropTypes.object,
  //   PropTypes.string,
  //   PropTypes.number,
  //   PropTypes.bool
  // ),
  handleChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(SubItem);
