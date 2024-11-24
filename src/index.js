import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global styles
import App from './App'; // Main application component

// Initialize the root element for React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component within the root element
root.render(
  <React.StrictMode>
    {/* Wrap the App component in React's StrictMode for highlighting potential issues */}
    <App />
  </React.StrictMode>
);
