// @flow
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import PaletteIcon from '@material-ui/icons/Palette';

import ColorWheel, { Color } from './ColorWheel';

const useStyles = makeStyles((theme: Theme) => ({
  menu: {
    zIndex: 2000
  },
  menuContent: {
    padding: theme.spacing(2)
  }
}));

interface ColorAdornmentProps {
  color?: string;
  handleColorChange: (color: Color) => void;
}

let PopoverNode: HTMLButtonElement | null | undefined;
function ColorAdornment(props: ColorAdornmentProps) {
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const classes = useStyles();

  function handleToggleColorPicker() {
    setShowColorPicker(!showColorPicker);
  }

  return (
    <InputAdornment position="end">
      <IconButton
        size="small"
        aria-label="Pick Color"
        onClick={handleToggleColorPicker}
        ref={node => {
          PopoverNode = node;
        }}>
        <PaletteIcon fontSize="small" />
      </IconButton>
      <Popover
        className={classes.menu}
        id="options"
        anchorEl={PopoverNode}
        open={showColorPicker}
        onClose={handleToggleColorPicker}>
        <Paper className={classes.menuContent}>
          <ColorWheel
            color={props.color}
            lighting={true}
            handleColorChange={props.handleColorChange}
          />
        </Paper>
      </Popover>
    </InputAdornment>
  );
}

ColorAdornment.propTypes = {};

export default ColorAdornment;
