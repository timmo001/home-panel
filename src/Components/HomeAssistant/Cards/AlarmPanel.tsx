// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

import { EntityProps } from './Entity';
import properCase from '../../Utils/properCase';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flex: 1
  },
  text: {
    marginBottom: theme.spacing(0.2),
    overflow: 'hidden',
    textAlign: 'center',
    textOverflow: 'ellipsis'
  },
  input: {
    marginTop: theme.spacing(0.5),
    width: 60
  },
  codes: {
    maxWidth: 168
  }
}));

interface AlarmPanelProps extends EntityProps {}

function AlarmPanel(props: AlarmPanelProps) {
  const [code, setCode] = React.useState('');
  const classes = useStyles();
  let entity: any, state: string | undefined, attributes: any | undefined;

  if (!props.hassEntities) {
    state = 'Home Assistant not connected.';
    props.card.disabled = true;
  } else
    entity = props.hassEntities[props.card.entity!];

  if (!entity && !state) {
    props.card.disabled = true;
    state = `${props.card.entity} not found`;
  } else if (!state) {
    props.card.disabled = false;
    attributes = entity.attributes;
  }

  if (!entity)
    return (
      <Grid
        className={classes.root}
        container
        direction="row"
        alignContent="space-between"
        justify="center">
        <Grid item xs>
          <Typography
            className={classes.text}
            color="textPrimary"
            variant="body1"
            component="h5">
            {state}
          </Typography>
        </Grid>
      </Grid>
    );

  function handleCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCode(event.target.value);
  }

  const handleCodePressed = (digit?: string) => () => {
    if (digit) setCode(code + digit);
    else setCode('');
  };

  const handleUpdate = (service: string) => () => {
    props.handleHassChange!(props.card.domain!, service, {
      entity_id: props.card.entity,
      code
    });
    setCode('');
  };

  const armed =
    entity.state === 'armed_away' || entity.state === 'armed_home';

  console.log(armed);

  return (
    <Grid
      className={classes.root}
      container
      alignItems="center"
      justify="space-between"
      direction="column">
      <Typography
        className={classes.text}
        color="textPrimary"
        variant="body1"
        component="h5">
        {properCase(entity.state)}
      </Typography>
      {props.card.width > 1 && (
        <Grid
          item
          container
          spacing={1}
          alignItems="center"
          justify="center"
          direction="row">
          {!armed && (
            <Grid item>
              <Button
                color="primary"
                onClick={handleUpdate('alarm_arm_away')}
                disabled={
                  (attributes.code_arm_required && !code) ||
                  entity.state === 'pending'
                }>
                Arm Away
              </Button>
            </Grid>
          )}
          {!armed && (
            <Grid item>
              <Button
                color="primary"
                onClick={handleUpdate('alarm_arm_home')}
                disabled={
                  (attributes.code_arm_required && !code) ||
                  entity.state === 'pending'
                }>
                Arm Home
              </Button>
            </Grid>
          )}
          {armed && (
            <Grid item>
              <Button
                color="primary"
                onClick={handleUpdate('alarm_disarm')}
                disabled={
                  (attributes.code_arm_required && !code) ||
                  entity.state === 'pending'
                }>
                Disarm
              </Button>
            </Grid>
          )}
        </Grid>
      )}
      {attributes.code_arm_required && props.card.width > 1 && (
        <Grid item>
          <Input
            className={classes.input}
            inputProps={{
              'aria-label': 'code',
              style: { textAlign: 'center' }
            }}
            disabled={entity.state === 'pending'}
            placeholder="1234"
            type="number"
            value={code}
            onChange={handleCodeChange}
          />
        </Grid>
      )}
      {attributes.code_arm_required &&
        props.card.width > 1 &&
        props.card.height! > 1 && (
          <Grid
            className={classes.codes}
            item
            container
            alignItems="center"
            justify="center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((value: number) => (
              <Grid key={value} item xs={4}>
                <Button
                  disabled={entity.state === 'pending'}
                  onClick={handleCodePressed(String(value))}>
                  {value}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
    </Grid>
  );
}

AlarmPanel.propTypes = {
  card: PropTypes.any.isRequired,
  hassConfig: PropTypes.any,
  hassEntities: PropTypes.any
};

export default AlarmPanel;
