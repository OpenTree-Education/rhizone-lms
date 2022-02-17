import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { SessionProvider } from './components/SessionContext';
import { SettingsProvider } from './components/SettingsContext';
import { WebSocketProvider } from './components/WebSocketContext';

ReactDOM.render(
  <React.StrictMode>
    <SettingsProvider>
      <SessionProvider>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </SessionProvider>
    </SettingsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
