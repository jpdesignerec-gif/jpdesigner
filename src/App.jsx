import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CommandSearch, Footer, Header, MobileNav, Toast } from './components/UI';
import { CookieConsent, FloatingWhatsApp, RouteMeta, ScrollTop, SkipLink } from './components/Advanced';
import { GlobalContextMenu, MotionSystem } from './components/Experience';
import { AboutPage, ContactPage, HomePage, LegalPage, NotFound, PlansPage, PortfolioPage, ProjectDetailPage, ServiceDetailPage, ServicesPage, ThankYouPage } from './pages/PublicPages';

const AdminRoutes = lazy(() => import('./admin/AdminRoutes'));

function PublicLayout({ children, onSearch }) { return <div className="site-shell"><SkipLink/><RouteMeta/><Header onSearch={onSearch}/><div id="main-content">{children}</div><Footer/><FloatingWhatsApp/><ScrollTop/><CookieConsent/><MobileNav/><GlobalContextMenu onSearch={onSearch}/></div>; }

export default function App() {
  const location=useLocation(); const [search,setSearch]=useState(false); const isAdmin=location.pathname.startsWith('/admin');
  useEffect(()=>{window.scrollTo(0,0)},[location.pathname]);
  useEffect(()=>{const handler=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearch(true)}if(e.key==='Escape')setSearch(false)};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[]);
  return <><MotionSystem/><Routes>
    <Route path="/admin/*" element={<Suspense fallback={<main className="admin-login"><div className="login-card"><p>Cargando administración…</p></div></main>}><AdminRoutes/></Suspense>}/>
    <Route path="*" element={<PublicRoutes onSearch={()=>setSearch(true)}/>}/>
  </Routes>{!isAdmin&&<CommandSearch open={search} onClose={()=>setSearch(false)}/>}<Toast/></>;
}

function PublicRoutes({onSearch}) { return <PublicLayout onSearch={onSearch}><Routes><Route path="/" element={<HomePage/>}/><Route path="/portfolio" element={<PortfolioPage/>}/><Route path="/portfolio/categoria/:categorySlug" element={<PortfolioPage/>}/><Route path="/portfolio/:slug" element={<ProjectDetailPage/>}/><Route path="/servicios" element={<ServicesPage/>}/><Route path="/servicios/:slug" element={<ServiceDetailPage/>}/><Route path="/planes" element={<PlansPage/>}/><Route path="/sobre-mi" element={<AboutPage/>}/><Route path="/contacto" element={<ContactPage/>}/><Route path="/terminos" element={<LegalPage type="terms"/>}/><Route path="/privacidad" element={<LegalPage type="privacy"/>}/><Route path="/cookies" element={<LegalPage type="cookies"/>}/><Route path="/gracias" element={<ThankYouPage/>}/><Route path="*" element={<NotFound/>}/></Routes></PublicLayout> }
