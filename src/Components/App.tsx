// @flow
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Onboarding from './Onboarding/Onboarding';

import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';

function App() {
  return (
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
  );
}

export default App;
