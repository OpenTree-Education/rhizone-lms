import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { SessionProvider } from './components/SessionContext';
import { SettingsProvider } from './components/SettingsContext';

ReactDOM.render(
  <React.StrictMode>
    <SettingsProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </SettingsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
