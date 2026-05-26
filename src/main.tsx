import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { inject } from '@vercel/analytics';
import App from './App.tsx';
import './index.css';

inject();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router hook={useHashLocation}>
      <App />
    </Router>
  </StrictMode>,
);
