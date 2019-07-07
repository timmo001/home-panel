// @flow
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import withMobileDialog, {
  WithMobileDialog
} from '@material-ui/core/withMobileDialog';

import Base, { BaseProps } from './Base';
import CardBase from '../../Cards/Base';

export type ResponsiveDialogProps = WithMobileDialog;

const useStyles = makeStyles((theme: Theme) => ({
  dialogContent: {
    paddingLeft: 0,
    paddingRight: 0
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
  fullScreen?: boolean;
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
  return (
    <Dialog
      open
      fullScreen={props.fullScreen}
      fullWidth={true}
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
            alignContent="center"
            justify="space-around">
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
  fullScreen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired
};

export default withMobileDialog()(EditCard);
