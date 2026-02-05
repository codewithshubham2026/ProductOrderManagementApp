// Import React library for JSX support
import React from 'react';
// Import ReactDOM client API for rendering React components
import ReactDOM from 'react-dom/client';
// Import the main App component that contains all routes and layout
import App from './App';
// Import global CSS module styles for the entire application
import './styles/ui.module.css';

// Create a root container and render the App component
// getElementById('root') finds the div element in index.html where React will mount
// React.StrictMode enables additional checks and warnings during development
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
