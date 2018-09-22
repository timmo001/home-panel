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
  dropdownText: {
    flex: '1 1 auto',
  },
});

class SubItem extends React.Component {
  state = {
    open: this.props.objKey ?
      Array.isArray(this.props.item) && this.props.item.length > 1 ?
        false : true :
      true
  };

  handleClick = () => this.setState(state => ({ open: !state.open }));

  render() {
    const { classes, objKey, defaultItem, item, itemPath, handleConfigChange } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        {Array.isArray(item) ?
          <div>
            <ListItem button onClick={this.handleClick}>
              <Typography className={classes.dropdownText} variant="title">{properCase(objKey)}</Typography>
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Divider />
            <Collapse in={open}>
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
            </Collapse>
          </div>
          :
          isObject(item) ?
            <div>
              {objKey &&
                <div>
                  <ListItem button onClick={this.handleClick}>
                    <Typography className={classes.dropdownText} variant="title">{properCase(objKey)}</Typography>
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Divider />
                </div>
              }
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
  itemPath: PropTypes.array.isRequired,
  handleConfigChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(SubItem);
