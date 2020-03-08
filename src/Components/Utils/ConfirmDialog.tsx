import React, { ReactElement } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface ConfirmDialogProps {
  text?: string;
  handleClose?: () => void;
  handleConfirm?: () => void;
}

function ConfirmDialog(props: ConfirmDialogProps): ReactElement {
  function handleClose(): void {
    if (props.handleClose) props.handleClose();
  }

  function handleConfirm(): void {
    handleClose();
    if (props.handleConfirm) props.handleConfirm();
  }

  return (
    <Dialog open>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.text ? props.text : 'Are you sure you want to do this?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>No</Button>
        <Button onClick={handleConfirm}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
