// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

import { BaseProps } from './Base';

const useStyles = makeStyles((_theme: Theme) => ({
  root: {
    height: '100%'
  },
  dialog: {
    height: '100%',
    width: '100%'
  },
  image: {
    width: '100%',
    marginBottom: -6,
    cursor: 'pointer'
  }
}));

interface ImageProps extends BaseProps {}

function Image(props: ImageProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  function handleToggleDialog() {
    setDialogOpen(!dialogOpen);
  }

  const classes = useStyles();

  return (
    <div className={classes.root} onClick={handleToggleDialog}>
      <img
        className={classes.image}
        src={props.card.url}
        alt={props.card.title}
      />
      {dialogOpen && (
        <Dialog open fullScreen>
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
