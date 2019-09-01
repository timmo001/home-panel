// @flow
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps
} from 'react-router-dom';

import clone from './Utils/clone';
import Onboarding from './Onboarding/Onboarding';

import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';

// TODO: Remove
console.log('APP - window.location:', clone(window.location));

const originLocation = clone(window.location);

function App() {
  // TODO: Remove
  console.log('APP - window.location:', clone(window.location));

  return (
    <Router>
      <Switch>
        <Route
          render={(rProps: RouteComponentProps) => (
            <Onboarding {...rProps} originLocation={originLocation} />
          )}
        />
      </Switch>
    </Router>
  );
}

export default App;
