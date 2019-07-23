// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Base, { BaseProps } from './Base';
import CardBase from '../../Cards/Base';

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    overflow: 'visible'
  },
  dialogContent: {
    paddingLeft: 0,
    paddingRight: 0,
    overflow: 'visible'
  },
  container: {},
  background: {
    padding: theme.spacing(2),
    background: theme.palette.background.default
  },
  editView: {
    padding: theme.spacing(2)
  }
}));

interface EditCardProps extends BaseProps {
  handleClose: () => void;
  handleUpdate: (data: any) => void;
}

function EditCard(props: EditCardProps) {
  const [card, setCard] = React.useState(props.card);

  useEffect(() => setCard(props.card), [props.card]);

  function handleClose() {
    props.handleClose();
  }

  function handleConfirm() {
    handleClose();
    props.handleUpdate(card);
  }

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    setCard({
      ...card,
      [name]: typeof event === 'string' ? event : event.target.value
    });
  };

  const handleSwitchChange = (name: string) => (
    _event: React.ChangeEvent<{}>,
    checked: boolean
  ) => {
    setCard({ ...card, [name]: checked });
  };

  function handleSelectChange(
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) {
    setCard({ ...card, [event.target.name as string]: event.target.value });
  }

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open
      fullScreen={fullScreen}
      fullWidth={true}
      PaperProps={{ className: classes.dialog }}
      maxWidth="lg"
      aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title">Edit Card</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid
          className={classes.container}
          container
          direction="row"
          alignContent="center"
          justify="center">
          <Grid
            className={classes.editView}
            item
            xs
            container
            direction="row"
            alignContent="flex-start"
            justify="flex-start"
            alignItems="stretch">
            <Base
              {...props}
              card={card}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleSwitchChange={handleSwitchChange}
            />
          </Grid>
          <Grid
            className={classes.background}
            item
            xs
            container
            alignContent="center"
            justify="space-around">
            <CardBase {...props} card={card} editing={0} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

EditCard.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired
};

export default EditCard;
