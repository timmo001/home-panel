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

import CardBase, { CardBaseProps } from './CardBase';

export type ResponsiveDialogProps = WithMobileDialog;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%'
  },
  dialogContent: {
    // padding: 0
  },
  background: {
    background: theme.palette.background.default
  }
}));

interface EditCardProps extends CardBaseProps {
  fullScreen?: boolean;
  handleClose: () => void;
}

function EditCard(props: EditCardProps) {
  const [card, setCard] = React.useState(props.card);

  useEffect(() => setCard(props.card), [props.card]);

  function handleClose() {
    props.handleClose();
  }

  function handleConfirm() {
    handleClose();
    props.handleUpdate!(props.id, card);
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
          container
          direction="row"
          alignContent="center"
          justify="space-around"
          spacing={2}>
          <Grid
            item
            xs
            container
            // direction="column"
            alignContent="center"
            justify="space-around"
            spacing={1}>
            <CardBase
              {...props}
              card={card}
              editing={2}
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
            justify="space-around"
            spacing={2}>
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
  // handleHassChange: PropTypes.func.isRequired,
};

export default withMobileDialog()(EditCard);
