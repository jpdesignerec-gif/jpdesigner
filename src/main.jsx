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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><AppErrorBoundary><BrowserRouter><SiteProvider><App /></SiteProvider></BrowserRouter></AppErrorBoundary></React.StrictMode>
);
