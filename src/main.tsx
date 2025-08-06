import '@/components/keenicons/assets/styles.css';
import './css/styles.css';
import { StrictMode } from 'react';
import { setupAxios } from '@/auth/lib/helpers.ts';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import { App } from './App';

setupAxios(axios);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
