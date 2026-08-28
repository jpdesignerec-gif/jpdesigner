import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CommandSearch, Footer, Header, MobileNav, Toast } from './components/UI';
import { CookieConsent, FloatingWhatsApp, RouteMeta, ScrollTop, SkipLink } from './components/Advanced';
import { GlobalContextMenu, MotionSystem } from './components/Experience';
import { AboutPage, ContactPage, HomePage, LegalPage, NotFound, PlansPage, PortfolioPage, ProjectDetailPage, ServiceDetailPage, ServicesPage, ThankYouPage } from './pages/PublicPages';
import { AdminGuard, AdminLayout, AdminLogin, CategoriesAdmin, ContentAdmin, Dashboard, InquiriesAdmin, MediaAdmin, PagesAdmin, PlansAdmin, ProjectsAdmin, ServicesAdmin, SettingsAdmin } from './admin/Admin';
import { TrashAdmin } from './admin/EditorialAdmin';

function PublicLayout({ children, onSearch }) { return <div className="site-shell"><SkipLink/><RouteMeta/><Header onSearch={onSearch}/><div id="main-content">{children}</div><Footer/><FloatingWhatsApp/><ScrollTop/><CookieConsent/><MobileNav/><GlobalContextMenu onSearch={onSearch}/></div>; }

export default function App() {
  const location=useLocation(); const [search,setSearch]=useState(false); const isAdmin=location.pathname.startsWith('/admin');
  useEffect(()=>{window.scrollTo(0,0)},[location.pathname]);
  useEffect(()=>{const handler=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearch(true)}if(e.key==='Escape')setSearch(false)};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[]);
  return <><MotionSystem/><Routes>
    <Route path="/admin/acceso" element={<AdminLogin/>}/>
    <Route element={<AdminGuard/>}><Route path="/admin" element={<AdminLayout/>}><Route index element={<Dashboard/>}/><Route path="paginas" element={<PagesAdmin/>}/><Route path="contenido" element={<ContentAdmin/>}/><Route path="portfolio" element={<ProjectsAdmin/>}/><Route path="categorias" element={<CategoriesAdmin/>}/><Route path="servicios" element={<ServicesAdmin/>}/><Route path="planes" element={<PlansAdmin/>}/><Route path="consultas" element={<InquiriesAdmin/>}/><Route path="medios" element={<MediaAdmin/>}/><Route path="papelera" element={<TrashAdmin/>}/><Route path="ajustes" element={<SettingsAdmin/>}/></Route></Route>
    <Route path="*" element={<PublicRoutes onSearch={()=>setSearch(true)}/>}/>
  </Routes>{!isAdmin&&<CommandSearch open={search} onClose={()=>setSearch(false)}/>}<Toast/></>;
}

function PublicRoutes({onSearch}) { return <PublicLayout onSearch={onSearch}><Routes><Route path="/" element={<HomePage/>}/><Route path="/portfolio" element={<PortfolioPage/>}/><Route path="/portfolio/categoria/:categorySlug" element={<PortfolioPage/>}/><Route path="/portfolio/:slug" element={<ProjectDetailPage/>}/><Route path="/servicios" element={<ServicesPage/>}/><Route path="/servicios/:slug" element={<ServiceDetailPage/>}/><Route path="/planes" element={<PlansPage/>}/><Route path="/sobre-mi" element={<AboutPage/>}/><Route path="/contacto" element={<ContactPage/>}/><Route path="/terminos" element={<LegalPage type="terms"/>}/><Route path="/privacidad" element={<LegalPage type="privacy"/>}/><Route path="/cookies" element={<LegalPage type="cookies"/>}/><Route path="/gracias" element={<ThankYouPage/>}/><Route path="*" element={<NotFound/>}/></Routes></PublicLayout> }
