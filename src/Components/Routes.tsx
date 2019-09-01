// @flow
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import clone from './Utils/clone';
import Onboarding from './Onboarding';

import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';

const originLocation = clone(window.location);

interface RoutesProps extends RouteComponentProps {}

function Routes(props: RoutesProps) {
  // TODO: Remove
  console.log('ROUTES - route location:', clone(props.location));

  return <Onboarding {...props} originLocation={originLocation} />;
}

export default Routes;
