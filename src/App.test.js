import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('logs in without crashing', () => {
  localStorage.setItem('username', process.env.REACT_APP_OVERRIDE_USERNAME);
  localStorage.setItem('password', process.env.REACT_APP_OVERRIDE_PASSWORD);
  localStorage.setItem('api_url', process.env.REACT_APP_OVERRIDE_API_URL);
  localStorage.setItem('hass_url', process.env.REACT_APP_OVERRIDE_HASS_URL);
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
