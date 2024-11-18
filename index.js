import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

// Create the root using createRoot API
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root
root.render(
  <Router>
    <App />
  </Router>
);