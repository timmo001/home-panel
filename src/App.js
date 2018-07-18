import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';
import './App.css';
import Root from './Root';

const themes = [
  {
    name: 'Light',
    theme: createMuiTheme({
      palette: {
        primary: lightBlue,
        secondary: blueGrey,
        mainBackground: grey[100],
        backgrounds: {
          light: blueGrey[600],
          main: blueGrey[400],
          dark: blueGrey[200],
        },
        defaultText: {
          light: grey[700],
          main: grey[800],
          dark: grey[900],
        },
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
      },
    })
  },
  {
    name: 'Dark',
    theme: createMuiTheme({
      palette: {
        type: 'dark',
        primary: blueGrey,
        secondary: blueGrey,
        mainBackground: grey[900],
        backgrounds: {
          light: blueGrey[900],
          main: blueGrey[800],
          dark: blueGrey[600],
        },
        defaultText: {
          light: grey[50],
          main: grey[100],
          dark: grey[200],
        },
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
      },
    })
  },
];

class App extends Component {
  state = {
    theme: themes[0].theme,
  };

  setTheme = (id) => this.setState({ theme: themes[id].theme });

  render() {
    const { theme } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Root theme={theme} setTheme={this.setTheme} />
      </MuiThemeProvider>
    );
  }
}

export default App;
