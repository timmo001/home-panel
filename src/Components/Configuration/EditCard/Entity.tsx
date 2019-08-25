// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { BaseProps } from './Base';
import EntitySelect from '../../HomeAssistant/EntitySelect';

const useStyles = makeStyles((theme: Theme) => ({
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: '1 1 auto',
    margin: 4
  }
}));

interface EntityProps extends BaseProps {}

function Entity(props: EntityProps) {
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="center" alignItems="stretch">
      <Grid item xs>
        {props.hassEntities ? (
          <EntitySelect
            {...props}
            entity={props.card.entity!}
            handleChange={props.handleChange!('entity')}
          />
        ) : (
          <TextField
            className={classes.textField}
            InputLabelProps={{ shrink: true }}
            label="Entity"
            placeholder="sensor.myamazingsensor"
            defaultValue={props.card.entity}
            onChange={props.handleChange!('entity')}
          />
        )}
      </Grid>
    </Grid>
  );
}

Entity.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any,
  handleChange: PropTypes.func
};

export default Entity;
