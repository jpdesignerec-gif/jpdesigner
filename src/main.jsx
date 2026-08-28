import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { SiteProvider } from './store/SiteStore';
import App from './App';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import './styles.css';
import './content.css';
import './editor-enhancements.css';
import { initMonitoring } from './utils/monitoring';

initMonitoring();

const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '');
const isHostedUnderStaticBase = import.meta.env.BASE_URL !== '/';
const Router = isHostedUnderStaticBase ? HashRouter : BrowserRouter;
const routerProps = isHostedUnderStaticBase ? {} : { basename };

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><AppErrorBoundary><Router {...routerProps}><SiteProvider><App /></SiteProvider></Router></AppErrorBoundary></React.StrictMode>
);
