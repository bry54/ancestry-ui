import '@/components/keenicons/assets/styles.css';
import './css/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from "axios";
import { App } from './App';
import {setupAxios} from "@/auth/lib";

setupAxios(axios)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
