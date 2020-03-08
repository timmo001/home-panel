import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';

import Onboarding from './Onboarding';

function App(): ReactElement {
  return (
    <Router>
      <Route component={Onboarding} />
    </Router>
  );
}

export default App;
