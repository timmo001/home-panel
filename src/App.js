import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import moment from 'moment';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import Root from './Components/Root';
import clone from './Components/Common/clone';
import mapToColor from './Components/Common/mapToColor';
import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';
import './App.css';

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
        navigation: grey[300],
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
        navigation: grey[800],
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
        if (theme.overrides.backgrounds.default) newTheme.palette.backgrounds.default = mapToColor(theme.overrides.backgrounds.default);
        if (theme.overrides.backgrounds.navigation) newTheme.palette.backgrounds.navigation = mapToColor(theme.overrides.backgrounds.navigation);
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