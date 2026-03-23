import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';  
import { App } from './App.tsx';
import './index.css';
import 'katex/dist/katex.min.css';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>   {/* WRAP HERE */}
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);