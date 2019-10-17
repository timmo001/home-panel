// @flow
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import iro from '@jaames/iro';
import iroTransparencyPlugin from 'iro-transparency-plugin';
import useTheme from '@material-ui/core/styles/useTheme';

import clone from '../../Utils/clone';

export type Color = {
  rgb: {
    r: any;
    g: any;
    b: any;
  };
  rgba: {
    r: any;
    g: any;
    b: any;
    a: any;
  };
  hexString: string;
  hex8String: string;
  rgbaString: string;
};

interface ColorWheelProps {
  color?: string;
  lighting?: boolean;
  handleColorChange: (color: Color) => void;
}

function validateColor(color: string, sixHex?: boolean): boolean {
  const c = clone(color);
  const isString = typeof c === 'string';
  if (isString && sixHex && /^(?:#?|0x?)[0-9a-fA-F]{3,6}$/.test(c)) {
  } else if (isString && !sixHex && /^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(c)) {
  } else if (isString && /^rgba?/.test(c)) {
    if (c.substring(c.indexOf('(') + 1, c.length - 1).match(/[^0-9, ]+/))
      return false;
  } else if (isString && /^hsla?/.test(c)) {
    if (c.substring(c.indexOf('(') + 1, c.length - 1).match(/[^0-9, ]+/))
      return false;
  } else return false;
  return true;
}

let pickerNode: HTMLDivElement | null | undefined;
function ColorWheel(props: ColorWheelProps) {
  const [color, setColor] = React.useState();
  const [pickerSetup, setPickerSetup] = React.useState(false);

  const theme = useTheme();

  const handleSetColor = useCallback((color: string) => {
    setColor(color);
  }, []);

  useEffect(() => {
    if (props.color && props.color !== color) {
      handleSetColor(props.color);
      setPickerSetup(true);
    }
  }, [props.color, color, handleSetColor]);

  useEffect(() => {
    if (!pickerSetup) {
      iro.use(iroTransparencyPlugin);
      let colorPicker: {
        on: (arg0: string, arg1: (c: Color) => void) => void;
      } | null;
      try {
        let c = color
          ? color
          : props.color
          ? props.color
          : theme.palette.background.paper;
        if (!c) c = 'rgba(255, 255, 255, 1)';
        if (!validateColor(c)) c = 'rgba(255, 255, 255, 1)';

        colorPicker = new iro.ColorPicker(pickerNode, {
          width: 200,
          padding: 0,
          borderWidth: 1,
          borderColor: theme.palette.background.paper,
          color: c,
          transparency: props.lighting ? true : false,
          layout: !props.lighting && [
            {
              component: iro.ui.Wheel,
              options: {}
            }
          ]
        });
        if (colorPicker)
          colorPicker.on('input:end', (c: Color) => {
            handleSetColor(
              `rgba(${c.rgba.r}, ${c.rgba.g}, ${c.rgba.b}, ${c.rgba.a})`
            );
            props.handleColorChange(c);
          });
      } catch (error) {
        console.error('Color Picker - Error caught:', error);
        colorPicker = null;
        handleSetColor('rgba(255, 255, 255, 1)');
      }
    }
  }, [
    props,
    props.color,
    color,
    pickerSetup,
    handleSetColor,
    theme.palette.background.paper
  ]);

  return (
    <div
      ref={node => {
        pickerNode = node;
      }}
    />
  );
}

ColorWheel.propTypes = {
  color: PropTypes.string,
  handleColorChange: PropTypes.func.isRequired
};

export default ColorWheel;
