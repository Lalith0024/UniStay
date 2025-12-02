import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from '/Users/kasulalalithendra/capstone-3/frontend/App.jsx';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
