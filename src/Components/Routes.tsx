// @flow
import React, { useEffect } from 'react';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router-dom';

import clone from './Utils/clone';
import Onboarding from './Onboarding';

import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';

const originLocation = clone(window.location);

interface RoutesProps extends RouteComponentProps {}

function Routes(props: RoutesProps) {
  useEffect(() => {
    // TODO: Remove
    console.log('ROUTES - route props:', clone(props.location));
    console.log('ROUTES - route history:', clone(props.history));
    console.log('ROUTES - route match:', clone(props.match));
    console.log('ROUTES - window.location:', clone(window.location));
  });

  return (
    <Switch>
      <Route
        exact
        path="/login|overview|configuration/"
        render={(rProps: RouteComponentProps) => (
          <Onboarding {...rProps} originLocation={originLocation} />
        )}
      />
      <Redirect to="overview" />
    </Switch>
  );
}

export default Routes;
