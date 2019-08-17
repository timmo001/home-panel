// @flow
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import pink from '@material-ui/core/colors/pink';
import purple from '@material-ui/core/colors/purple';

import Onboarding from './Onboarding/Onboarding';

import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';

let theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: pink,
    secondary: purple,
    background: {
      default: '#303030',
      paper: '#383c45'
    }
  }
});
theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route
            exact
            path="/(login|overview|configuration)/"
            component={Onboarding}
          />
          <Redirect to="/overview" />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
