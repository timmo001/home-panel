// @flow
import { Color } from '@material-ui/core';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';
import brown from '@material-ui/core/colors/brown';
import common, { CommonColors } from '@material-ui/core/colors/common';
import cyan from '@material-ui/core/colors/cyan';
import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import indigo from '@material-ui/core/colors/indigo';
import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import lime from '@material-ui/core/colors/lime';
import orange from '@material-ui/core/colors/orange';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import teal from '@material-ui/core/colors/teal';
import yellow from '@material-ui/core/colors/yellow';

import { ThemesProps, defaultTheme } from 'Components/Configuration/Config';
import clone from './clone';

const mapColor = (color: string): Color | CommonColors =>
  color === 'amber'
    ? amber
    : color === 'blue'
    ? blue
    : color === 'blueGrey'
    ? blueGrey
    : color === 'brown'
    ? brown
    : color === 'common'
    ? common
    : color === 'cyan'
    ? cyan
    : color === 'deepOrange'
    ? deepOrange
    : color === 'deepPurple'
    ? deepPurple
    : color === 'green'
    ? green
    : color === 'grey'
    ? grey
    : color === 'indigo'
    ? indigo
    : color === 'lightBlue'
    ? lightBlue
    : color === 'lightGreen'
    ? lightGreen
    : color === 'lime'
    ? lime
    : color === 'orange'
    ? orange
    : color === 'pink'
    ? pink
    : color === 'purple'
    ? purple
    : color === 'red'
    ? red
    : color === 'teal'
    ? teal
    : color === 'yellow'
    ? yellow
    : grey;

const parseTheme = (palette: ThemesProps) => {
  let paletteNew = clone(palette);
  paletteNew.primary = mapColor(String(paletteNew.primary));
  paletteNew.secondary = mapColor(String(paletteNew.secondary));
  paletteNew.background = {
    default: paletteNew.background_default,
    paper: paletteNew.background_paper
  };
  delete paletteNew.background_default;
  delete paletteNew.background_paper;
  // Handle bad config
  if (!paletteNew.type.match(/light|dark/gi))
    paletteNew.type = defaultTheme().type;
  return paletteNew;
};

export default parseTheme;
