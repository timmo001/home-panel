import React, { useEffect, ReactElement, useState } from "react";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { GroupProps } from "./Config";

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    overflow: "visible",
  },
  dialogContent: {
    overflow: "visible",
  },
  container: {},
  textField: {
    width: `calc(100% - ${theme.spacing(1)}px)`,
    flex: "1 1 auto",
    margin: 4,
  },
}));

interface EditGroupProps {
  group: GroupProps;
  handleClose: () => void;
  handleUpdate: (data: GroupProps) => void;
}

function EditGroup(props: EditGroupProps): ReactElement {
  const [group, setGroup] = useState(props.group);

  useEffect(() => setGroup(props.group), [props.group]);

  function handleClose(): void {
    props.handleClose();
  }

  function handleConfirm(): void {
    handleClose();
    props.handleUpdate(group);
  }

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setGroup({
      ...group,
      [name]: typeof event === "string" ? event : event.target.value,
    });
  };

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open
      fullScreen={fullScreen}
      fullWidth={true}
      PaperProps={{ className: classes.dialog }}
      maxWidth="md"
      aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title">Edit Group</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid
          className={classes.container}
          container
          direction="row"
          justify="flex-start"
          alignContent="stretch">
          <Grid item xs container justify="flex-start" alignContent="center">
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              label="Name"
              placeholder={"Group Name"}
              defaultValue={props.group.name || ""}
              onChange={handleChange("name")}
            />
          </Grid>
          <Grid item xs container justify="flex-start" alignContent="center">
            <TextField
              className={classes.textField}
              InputLabelProps={{ shrink: true }}
              type="number"
              label="Width"
              placeholder="2"
              defaultValue={props.group.width || ""}
              onChange={handleChange("width")}
            />
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

export default EditGroup;
