// @flow
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import iro from '@jaames/iro';
import useTheme from '@material-ui/core/styles/useTheme';

export type Color = {
  rgb: {
    r: any;
    g: any;
    b: any;
  };
  hexString: string;
};

interface ColorWheelProps {
  color?: string;
  lighting?: boolean;
  handleColorChange: (color: Color) => void;
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
    if (props.color && props.color !== color) handleSetColor(props.color);
  }, [props.color, color, handleSetColor]);

  useEffect(() => {
    if (!pickerSetup && color) {
      let colorPicker;
      try {
        colorPicker = new iro.ColorPicker(pickerNode, {
          width: 200,
          padding: 0,
          borderWidth: 1,
          borderColor: theme.palette.background.paper,
          color: color ? color : props.color ? props.color : '#ffffff',
          layout: !props.lighting && [
            {
              component: iro.ui.Wheel,
              options: {}
            }
          ]
        });
      } catch {
        colorPicker = new iro.ColorPicker(pickerNode, {
          width: 200,
          padding: 0,
          borderWidth: 1,
          borderColor: theme.palette.background.paper,
          color: '#ffffff',
          layout: !props.lighting && [
            {
              component: iro.ui.Wheel,
              options: {}
            }
          ]
        });
      }

      colorPicker.on('input:end', (c: Color) => {
        handleSetColor(`rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`);
        props.handleColorChange(c);
      });

      setPickerSetup(true);
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
