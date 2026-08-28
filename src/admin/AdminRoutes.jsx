import { Route, Routes } from "react-router-dom";
import {
  AdminGuard,
  AdminLayout,
  AdminLogin,
  CategoriesAdmin,
  ContentAdmin,
  Dashboard,
  InquiriesAdmin,
  MediaAdmin,
  PagesAdmin,
  PlansAdmin,
  ProjectsAdmin,
  ServicesAdmin,
  SettingsAdmin,
} from "./Admin";
import { TrashAdmin } from "./EditorialAdmin";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="acceso" element={<AdminLogin />} />
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="paginas" element={<PagesAdmin />} />
          <Route path="contenido" element={<ContentAdmin />} />
          <Route path="portfolio" element={<ProjectsAdmin />} />
          <Route path="categorias" element={<CategoriesAdmin />} />
          <Route path="servicios" element={<ServicesAdmin />} />
          <Route path="planes" element={<PlansAdmin />} />
          <Route path="consultas" element={<InquiriesAdmin />} />
          <Route path="medios" element={<MediaAdmin />} />
          <Route path="papelera" element={<TrashAdmin />} />
          <Route path="ajustes" element={<SettingsAdmin />} />
        </Route>
      </Route>
    </Routes>
  );
}
