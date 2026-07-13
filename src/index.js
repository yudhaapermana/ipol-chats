import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Main from './Main';
import 'helpers/initFA';
import 'css/2.0.css';
import 'css/utilityfalcon.css?20240109-01';
import 'css/timeline.css?20230809-08';
import 'css/main.css?202308024-08';
import 'css/falcon-color.css?202308024-10';
import 'css/jquery.confirm.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ConfirmationModalContextProvider from 'context/modalConfirmationContext';
const container = document.getElementById('main');
const root = createRoot(container);

root.render(
  //<React.StrictMode>
  <ConfirmationModalContextProvider>
    <Main>
      <App />
    </Main>
  </ConfirmationModalContextProvider>
  //</React.StrictMode>
);
