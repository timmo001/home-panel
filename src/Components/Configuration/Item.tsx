// @flow
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { ConfigurationProps } from './Configuration';
import Section from './Section';

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginRight: theme.spacing(2),
    fontSize: 24
  },
  iconButton: {
    fontSize: 22,
    height: 24
  },
  item: {
    padding: theme.spacing(1.5, 1),
    borderBottom: '1px solid #EEE',
    '&:first-child': {
      paddingTop: 0
    },
    '&:last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row'
  },
  textField: {
    maxWidth: 100
  }
}));

interface ItemProps extends ConfigurationProps {}

function Item(props: ItemProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleDialogToggle() {
    setDialogOpen(!dialogOpen);
  }

  const classes = useStyles();

  const lastItem = props.path!.pop();
  let secondLastItem = props.path!.reduce(
    (o, k) => (o[k] = o[k] || {}),
    props.config
  );
  const value = secondLastItem[lastItem];

  switch (props.item.type) {
    default:
      return null;
    case 'input':
      return (
        <TextField
          className={classes.textField}
          placeholder={String(props.item.default)}
          type={typeof props.item.default === 'number' ? 'number' : 'text'}
          defaultValue={value}
          onChange={props.handleChange!(
            [...props.path!, props.item.name],
            typeof props.item.default === 'number' ? 'number' : 'string'
          )}
        />
      );
    case 'radio':
      return (
        <FormControl component="fieldset">
          <RadioGroup
            className={classes.radioGroup}
            aria-label={props.item.title}
            name={props.item.name}
            defaultValue={value}
            onChange={props.handleRadioChange!([
              ...props.path!,
              props.item.name
            ])}>
            {props.item.items.map((rItem: any) => (
              <FormControlLabel
                key={rItem.name}
                value={rItem.name}
                label={rItem.title}
                control={<Radio color="primary" />}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );
    case 'switch':
      return (
        <Switch
          color="primary"
          defaultChecked={value}
          onChange={props.handleSwitchChange!([
            ...props.path!,
            props.item.name
          ])}
        />
      );
    case 'array':
      return (
        <div>
          <IconButton
            color="inherit"
            aria-label="Edit"
            onClick={handleDialogToggle}>
            <span
              className={classnames('mdi', 'mdi-pencil', classes.iconButton)}
            />
          </IconButton>
          <Dialog open={dialogOpen} onClose={handleDialogToggle}>
            <DialogTitle>{props.item.title}</DialogTitle>
            <DialogContent>
              <Grid
                container
                direction="column"
                alignItems="center"
                className={classes.item}>
                {Array.isArray(value) &&
                  value.map((items: any[], id: number) => {
                    return (
                      <Grid
                        key={id}
                        item
                        container
                        direction="row"
                        alignItems="center"
                        className={classes.item}>
                        <Grid item xs>
                          <Section
                            key={id}
                            {...props}
                            path={[...props.path!, id]}
                            section={{ name: id, items: props.item.items }}
                          />
                        </Grid>
                        <Grid item>
                          <IconButton
                            onClick={props.handleDelete!([
                              ...props.path!,
                              props.item.name,
                              id
                            ])}>
                            <span
                              className={classnames(
                                'mdi',
                                'mdi-delete',
                                classes.iconButton
                              )}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    );
                  })}
                <IconButton
                  color="inherit"
                  aria-label="Add"
                  onClick={props.handleAdd!(
                    [
                      ...props.path!,
                      props.item.name,
                      Array.isArray(value) ? value.length : 0
                    ],
                    props.item.default[0]
                  )}>
                  <span
                    className={classnames(
                      'mdi',
                      'mdi-plus',
                      classes.iconButton
                    )}
                  />
                </IconButton>
              </Grid>
            </DialogContent>
          </Dialog>
        </div>
      );
  }
}

Item.propTypes = {
  config: PropTypes.any,
  item: PropTypes.any.isRequired,
  path: PropTypes.array.isRequired,
  section: PropTypes.any.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleRadioChange: PropTypes.func.isRequired,
  handleSwitchChange: PropTypes.func.isRequired
};

export default Item;
