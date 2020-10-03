import React, { ReactElement, Fragment, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import ArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import CopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { BaseProps } from "./Base";
import ConfirmDialog from "../Utils/ConfirmDialog";
import EditCard from "../Configuration/EditCard/EditCard";

const useStyles = makeStyles((theme: Theme) => ({
  cardActions: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    padding: theme.spacing(0.5),
    zIndex: 1000,
    transition: ".4s ease",
    background: theme.palette.background.paper,
    opacity: 0,
    "&:hover": {
      opacity: 1,
    },
  },
}));

function Overlay(props: BaseProps): ReactElement {
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [editCard, setEditCard] = useState<boolean>(false);

  function handleDeleteConfirm(): void {
    setDeleteConfirm(true);
  }

  function handleConfirmClose(): void {
    setDeleteConfirm(false);
  }

  function handleEdit(): void {
    setEditCard(true);
  }

  function handleEditClose(): void {
    setEditCard(false);
  }

  const classes = useStyles();
  return (
    <Fragment>
      <Grid
        className={classes.cardActions}
        container
        alignContent="center"
        alignItems="center"
        justify="center">
        <IconButton color="primary" onClick={handleEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton color="primary" onClick={handleDeleteConfirm}>
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton color="primary" onClick={props.handleCopy}>
          <CopyIcon fontSize="small" />
        </IconButton>
        <IconButton
          disabled={props.position === 0}
          color="primary"
          onClick={props.handleMoveUp}>
          <ArrowLeftIcon fontSize="small" />
        </IconButton>
        <IconButton
          disabled={props.position === props.maxPosition}
          color="primary"
          onClick={props.handleMoveDown}>
          <ArrowRightIcon fontSize="small" />
        </IconButton>
        {deleteConfirm && (
          <ConfirmDialog
            text="Are you sure you want to delete this card?"
            handleClose={handleConfirmClose}
            handleConfirm={props.handleDelete}
          />
        )}
      </Grid>
      {editCard && (
        <EditCard
          {...props}
          card={props.card}
          command={props.command}
          handleClose={handleEditClose}
          handleUpdate={props.handleUpdate}
        />
      )}
    </Fragment>
  );
}

export default Overlay;
