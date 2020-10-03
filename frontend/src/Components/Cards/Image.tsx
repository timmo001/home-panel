import React, { useEffect, useCallback, ReactElement, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";

import { BaseProps } from "./Base";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
  },
  dialogPaper: {
    background: theme.palette.background.default,
  },
  dialog: {
    height: "100%",
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
    objectFit: "scale-down",
    marginBottom: -6,
    cursor: "pointer",
  },
}));

function Image(props: BaseProps): ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSetDialogOpen = useCallback((open: boolean) => {
    setDialogOpen(open);
  }, []);

  function handleToggleDialog(): void {
    handleSetDialogOpen(!dialogOpen);
  }

  useEffect(() => {
    if (props.command && props.command.card === props.card.key) {
      if (props.command.command === "expand") handleSetDialogOpen(true);
      else if (props.command.command === "unexpand") handleSetDialogOpen(false);
    }
  }, [props.command, props.card.key, handleSetDialogOpen]);

  const classes = useStyles();

  return (
    <div className={classes.root} onClick={handleToggleDialog}>
      <img
        className={classes.image}
        src={props.card.url}
        alt={props.card.title}
      />
      {dialogOpen && (
        <Dialog PaperProps={{ className: classes.dialogPaper }} open fullScreen>
          <div className={classes.dialog}>
            <img
              className={classes.image}
              src={props.card.url}
              alt={props.card.title}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default Image;
