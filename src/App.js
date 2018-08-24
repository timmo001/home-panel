import React, { Component } from 'react';
import moment from 'moment';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';
import './App.css';
import Root from './Components/Root';
import clone from './Components/Utils/clone';

var themes = [
  {
    id: 1,
    name: 'Light',
    palette: {
      type: 'light',
      primary: blueGrey,
      secondary: grey,
      mainBackground: grey[100],
      backgrounds: {
        light: blueGrey[600],
        main: blueGrey[400],
        dark: blueGrey[200],
        cardDisabled: grey[200],
      },
      defaultText: {
        light: grey[700],
        main: grey[800],
        dark: grey[900],
      },
      error: red,
      contrastThreshold: 3,
      tonalOffset: 0.2,
    }
  },
  {
    id: 2,
    name: 'Dark',
    palette: {
      type: 'dark',
      primary: blueGrey,
      secondary: grey,
      mainBackground: grey[900],
      backgrounds: {
        light: blueGrey[900],
        main: blueGrey[800],
        dark: blueGrey[600],
        cardDisabled: grey[700],
      },
      defaultText: {
        light: grey[50],
        main: grey[100],
        dark: grey[200],
      },
      error: red,
      contrastThreshold: 3,
      tonalOffset: 0.2,
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
    // var newTheme = { ...base ? base : themes[0] };
    var newTheme = clone(themes[0]);
    if (base) newTheme = clone(base);
    console.log('newTheme pre:', newTheme);
    newTheme.id = themes[themes.length - 1].id + 1;
    newTheme.name = theme.name;
    if (theme.overrides) {
      if (theme.overrides.type) newTheme.palette.type = theme.overrides.type;
      if (theme.overrides.primary) newTheme.palette.primary = theme.overrides.primary;
      if (theme.overrides.secondary) newTheme.palette.secondary = theme.overrides.secondary;
      if (theme.overrides.mainBackground) newTheme.palette.mainBackground = theme.overrides.mainBackground;
      if (theme.overrides.backgrounds) {
        if (theme.overrides.backgrounds.light) newTheme.palette.backgrounds.light = theme.overrides.backgrounds.light;
        if (theme.overrides.backgrounds.main) newTheme.palette.backgrounds.main = theme.overrides.backgrounds.main;
        if (theme.overrides.backgrounds.dark) newTheme.palette.backgrounds.dark = theme.overrides.backgrounds.dark;
        if (theme.overrides.backgrounds.cardDisabled) newTheme.palette.backgrounds.cardDisabled = theme.overrides.backgrounds.cardDisabled;
      }
      if (theme.overrides.defaultText) {
        if (theme.overrides.defaultText.light) newTheme.palette.defaultText.light = theme.overrides.defaultText.light;
        if (theme.overrides.defaultText.main) newTheme.palette.defaultText.main = theme.overrides.defaultText.main;
        if (theme.overrides.defaultText.dark) newTheme.palette.defaultText.dark = theme.overrides.defaultText.dark;
      }
      if (theme.overrides.error) newTheme.palette.error = theme.overrides.error;
    }
    console.log('newTheme:', newTheme);
    themes.push(newTheme);
    console.log('themes:', themes);
  };

  render() {
    const { theme } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Root
          themes={themes}
          theme={theme}
          setTheme={this.setTheme}
          addTheme={this.addTheme} />
      </MuiThemeProvider>
    );
  }
}

export default App;