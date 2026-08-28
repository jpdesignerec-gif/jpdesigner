import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SiteProvider } from './store/SiteStore';
import App from './App';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import './styles.css';
import './content.css';
import './editor-enhancements.css';
import { initMonitoring } from './utils/monitoring';

initMonitoring();

const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><AppErrorBoundary><BrowserRouter basename={basename}><SiteProvider><App /></SiteProvider></BrowserRouter></AppErrorBoundary></React.StrictMode>
);
