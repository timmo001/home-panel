import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
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
        defaultText: grey[900],
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
        defaultText: grey[100],
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
    return (
      <MuiThemeProvider theme={this.state.theme}>
        <Router>
          <div>
            <Switch>
              <Route exact path="/view/:entity_id" render={() => <Root setTheme={this.setTheme} />} />
              <Redirect from="/" to="/view/group.default_view" />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
