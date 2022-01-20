import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { SessionProvider } from './components/SessionContext';

ReactDOM.render(
  <React.StrictMode>
    <SessionProvider>
      <App />
    </SessionProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
