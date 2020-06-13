import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Onboarding from './Onboarding';

import '@mdi/font/css/materialdesignicons.min.css';
import 'typeface-roboto';

function App(): ReactElement {
  return (
    <Router>
      <Route component={Onboarding} />
    </Router>
  );
}

export default App;
