import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

console.log('index.tsx is being loaded');

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

console.log('Found root element, mounting React app');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('React app mounted');
