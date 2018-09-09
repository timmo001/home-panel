import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import moment from 'moment';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';
import brown from '@material-ui/core/colors/brown';
import common from '@material-ui/core/colors/common';
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
import Root from './Components/Root';
import clone from './Components/Common/clone';
import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';
import './App.css';

const mapToColor = (str) => {
  if (str.startsWith('url')) return str;
  if (str.startsWith('#')) return str;
  var strRef = undefined;
  if (str.includes('[')) {
    const bracketIndex = str.indexOf('[');
    strRef = str.substr(bracketIndex + 1, (str.indexOf(']') - 1) - bracketIndex);
    str = str.substr(0, bracketIndex);
  }
  var color;
  switch (str) {
    default: color = str; break;
    case 'amber': color = amber; break;
    case 'blue': color = blue; break;
    case 'blueGrey': color = blueGrey; break;
    case 'brown': color = brown; break;
    case 'common': color = common; break;
    case 'cyan': color = cyan; break;
    case 'deepOrange': color = deepOrange; break;
    case 'deepPurple': color = deepPurple; break;
    case 'green': color = green; break;
    case 'grey': color = grey; break;
    case 'indigo': color = indigo; break;
    case 'lightBlue': color = lightBlue; break;
    case 'lightGreen': color = lightGreen; break;
    case 'lime': color = lime; break;
    case 'orange': color = orange; break;
    case 'pink': color = pink; break;
    case 'purple': color = purple; break;
    case 'red': color = red; break;
    case 'teal': color = teal; break;
    case 'yellow': color = yellow; break;
  }
  if (strRef) color = color[strRef];
  return color;
};

var themes = [
  {
    id: 1,
    name: 'Light',
    palette: {
      type: 'light',
      primary: blueGrey,
      secondary: grey,
      backgrounds: {
        main: grey[100],
        default: grey[200],
        card: {
          on: blueGrey[300],
          off: grey[300],
          disabled: grey[200],
          alarm: {
            home: blueGrey[300],
            away: blueGrey[300],
            triggered: red[400],
          }
        }
      },
      text: {
        light: grey[700],
        main: grey[800],
        icon: grey[700],
      },
      error: red,
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  },
  {
    id: 2,
    name: 'Dark',
    palette: {
      type: 'dark',
      primary: blueGrey,
      secondary: grey,
      backgrounds: {
        main: grey[900],
        default: grey[800],
        card: {
          on: blueGrey[700],
          off: grey[800],
          disabled: grey[700],
          alarm: {
            home: blueGrey[700],
            away: blueGrey[700],
            triggered: red[700],
          }
        }
      },
      text: {
        light: grey[50],
        main: grey[100],
        icon: grey[50],
      },
      error: red,
      contrastThreshold: 3,
      tonalOffset: 0.2
    }
  }
];

const defaultPalette = moment().hour >= 22 || moment().hour <= 4 ?
  createMuiTheme({ palette: themes[1].palette })
  :
  createMuiTheme({ palette: themes[0].palette });

class App extends Component {
  state = {
    theme: defaultPalette
  };

  setTheme = (id) => {
    const theme = themes.find(t => t.id === id);
    const palette = theme ? theme.palette : themes[0].palette;
    this.setState({
      theme: createMuiTheme({ palette })
    });
  };

  addTheme = (theme) => {
    const base = themes.find(t => t.name.toLowerCase() === theme.base.toLowerCase());
    var newTheme = clone(themes[0]);
    if (base) newTheme = clone(base);
    newTheme.id = themes[themes.length - 1].id + 1;
    newTheme.name = theme.name;
    if (theme.overrides) {
      if (theme.overrides.type) newTheme.palette.type = theme.overrides.type;
      if (theme.overrides.primary) newTheme.palette.primary = mapToColor(theme.overrides.primary);
      if (theme.overrides.secondary) newTheme.palette.secondary = mapToColor(theme.overrides.secondary);
      if (theme.overrides.backgrounds) {
        if (theme.overrides.backgrounds.main) newTheme.palette.backgrounds.main = mapToColor(theme.overrides.backgrounds.main);
        if (theme.overrides.backgrounds.default) newTheme.palette.backgrounds.dark = mapToColor(theme.overrides.backgrounds.default);
        if (theme.overrides.backgrounds.card) {
          if (theme.overrides.backgrounds.card.on) newTheme.palette.backgrounds.card.on = mapToColor(theme.overrides.backgrounds.card.on);
          if (theme.overrides.backgrounds.card.off) newTheme.palette.backgrounds.card.off = mapToColor(theme.overrides.backgrounds.card.off);
          if (theme.overrides.backgrounds.card.disabled) newTheme.palette.backgrounds.card.disabled = mapToColor(theme.overrides.backgrounds.card.disabled);
          if (theme.overrides.backgrounds.card.alarm) {
            if (theme.overrides.backgrounds.card.alarm.home) newTheme.palette.backgrounds.card.alarm.home = mapToColor(theme.overrides.backgrounds.card.alarm.home);
            if (theme.overrides.backgrounds.card.alarm.away) newTheme.palette.backgrounds.card.alarm.away = mapToColor(theme.overrides.backgrounds.card.alarm.away);
            if (theme.overrides.backgrounds.card.alarm.triggered) newTheme.palette.backgrounds.card.alarm.triggered = mapToColor(theme.overrides.backgrounds.card.alarm.triggered);
          }
        }
      }
      if (theme.overrides.text) {
        if (theme.overrides.text.light) newTheme.palette.text.light = mapToColor(theme.overrides.text.light);
        if (theme.overrides.text.main) newTheme.palette.text.main = mapToColor(theme.overrides.text.main);
        if (theme.overrides.text.icon) newTheme.palette.text.icon = mapToColor(theme.overrides.text.icon);
      }
    }
    themes.push(newTheme);
  };

  render() {
    const { theme } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <Route render={props => (

            <Root
              themes={themes}
              theme={theme}
              setTheme={this.setTheme}
              addTheme={this.addTheme}
              {...props} />
          )} />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;