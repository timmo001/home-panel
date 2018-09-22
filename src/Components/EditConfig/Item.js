import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
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
    const { classes, objKey, defaultItem, item, itemPath, handleConfigChange } = this.props;

    return (
      <div className={classes.root}>
        {Array.isArray(item) ?
          <div>
            <Typography variant="title">{properCase(objKey)}</Typography>
            <Divider />
            {item.map((ai, ax) => {
              return <NextItem
                key={ax}
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
          </div>
          :
          isObject(item) ?
            <div>
              {objKey &&
                <div>
                  <Typography variant="title">{properCase(objKey)}</Typography>
                  <Divider />
                </div>
              }
              {Object.keys(defaultItem).map((i, x) => {
                return <NextItem
                  key={x}
                  objKey={i}
                  defaultItem={defaultItem[i]}
                  item={item[i]}
                  itemPath={itemPath.concat([i])}
                  handleConfigChange={handleConfigChange} />
              })}
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
  // itemPath: PropTypes.array.isRequired,
  handleConfigChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(SubItem);
