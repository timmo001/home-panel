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
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DeleteIcon from '@material-ui/icons/Delete';

import { ConfigProps, PageProps, GroupProps } from './Config';
import ConfirmDialog from '../Utils/ConfirmDialog';

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    overflow: 'visible'
  },
  dialogContent: {
    overflow: 'visible'
  },
  fill: {
    flex: 1
  },
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: '1 1 auto',
    margin: 4
  }
}));

interface EditPageProps extends ConfigProps {
  page: PageProps;
  handleClose: () => void;
  handleUpdate: (data: any) => void;
}

function EditPage(props: EditPageProps) {
  const [page, setPage] = React.useState(props.page);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  useEffect(() => setPage(props.page), [props.page]);

  function handleDeleteConfirm() {
    setDeleteConfirm(true);
  }

  function handleConfirmClose() {
    setDeleteConfirm(false);
  }

  function handleClose() {
    props.handleClose();
  }

  function handleConfirm() {
    handleClose();
    props.handleUpdate(page);
  }

  function handleDelete() {
    handleClose();
    props.handleUpdate(undefined);
  }

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPage({
      ...page,
      [name]: typeof event === 'string' ? event : event.target.value
    });
  };

  const foundGroups = props.config.groups.find(
    (group: GroupProps) => group.page === props.page.key
  )
    ? true
    : false;

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open
      fullScreen={fullScreen}
      fullWidth={true}
      PaperProps={{ className: classes.dialog }}
      maxWidth="md"
      aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title">Edit Page</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid
          container
          direction="row"
          alignContent="flex-start"
          justify="flex-start"
          alignItems="stretch">
          <Grid item xs container justify="flex-start" alignContent="center">
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              label="Name"
              placeholder={'Page Name'}
              defaultValue={props.page.name}
              onChange={handleChange('name')}
            />
          </Grid>
          <Grid item xs container justify="flex-start" alignContent="center">
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              label="Icon"
              placeholder={'home'}
              defaultValue={props.page.icon}
              onChange={handleChange('icon')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <IconButton
          color="primary"
          onClick={handleDeleteConfirm}
          disabled={foundGroups}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        {foundGroups && (
          <Typography variant="body2" component="span">
            To delete this page, first delete all groups inside this page.
          </Typography>
        )}
        <div className={classes.fill} />
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Save</Button>
      </DialogActions>
      {deleteConfirm && (
        <ConfirmDialog
          text="Are you sure you want to delete this page?"
          handleClose={handleConfirmClose}
          handleConfirm={handleDelete}
        />
      )}
    </Dialog>
  );
}

EditPage.propTypes = {
  page: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired
};

export default EditPage;
