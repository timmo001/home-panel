// @flow
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

import { BaseProps } from './Base';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%'
  },
  dialogPaper: {
    background: theme.palette.background.default
  },
  dialog: {
    height: '100%',
    width: '100%'
  },
  image: {
    height: '100%',
    width: '100%',
    objectFit: 'scale-down',
    marginBottom: -6,
    cursor: 'pointer'
  }
}));

interface ImageProps extends BaseProps {}

function Image(props: ImageProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleToggleDialog() {
    handleSetDialogOpen(!dialogOpen);
  }

  const handleSetDialogOpen = useCallback((open: boolean) => {
    setDialogOpen(open);
  }, []);

  useEffect(() => {
    if (
      props.command &&
      props.command.card &&
      props.command.card === props.card.key
    ) {
      if (props.command.command === 'expand') handleSetDialogOpen(true);
      else if (props.command.command === 'unexpand') handleSetDialogOpen(false);
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

Image.propTypes = {
  card: PropTypes.any.isRequired,
  editing: PropTypes.number,
  handleChange: PropTypes.func
};

export default Image;
