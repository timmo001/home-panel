import {
  PaletteOptions,
  PaletteColorOptions,
} from '@material-ui/core/styles/createPalette';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';
import brown from '@material-ui/core/colors/brown';
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

import { ThemeProps, defaultPalette } from '../Components/Configuration/Config';

const mapColor = (color: string): PaletteColorOptions =>
  color === 'amber'
    ? amber
    : color === 'blue'
    ? blue
    : color === 'blueGrey'
    ? blueGrey
    : color === 'brown'
    ? brown
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

export default function parseTheme(theme: ThemeProps): PaletteOptions {
  const palette: PaletteOptions = defaultPalette;

  if (theme.type && theme.type.match(/light|dark/gi)) palette.type = theme.type;

  if (theme.primary) palette.primary = mapColor(String(theme.primary));
  if (theme.secondary) palette.secondary = mapColor(String(theme.secondary));
  palette.background = {
    default: theme.background_default
      ? theme.background_default
      : defaultPalette.background?.default,
    paper: theme.background_paper
      ? theme.background_paper
      : defaultPalette.background?.paper,
  };
  palette.text = {
    primary: theme.text_primary
      ? theme.text_primary
      : defaultPalette.text?.primary,
  };
  return palette;
}
