import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layouts/MainLayout";
import LoginPage from "../app/auth/login/LoginPage";
import AdminPage from "../app/admin/AdminPage";
import ContactFormPage from "../app/contact-forms/ContactFormPage";
import { useAuth } from "../context/AuthProvider";
import HomePage from "../app/home/HomePage";
import PreviewPage from "../app/preview/PreviewPage";
import AboutMePage from "../app/aboutme/AboutMePage";
import PortfolioPage from "../app/portfolio/PortfolioPage";
import ContactPage from "../app/contact/ContactPage";
import SkillPage from "../app/skill/SkillPage";
import SkillCategoryPage from "../app/skill-category/SkillCategoryPage";
import ProjectsPage from "../app/projects/ProjectsPage";
import WorkExperiencePage from "../app/work-experience/WorkExperiencePage";
import SettingsPage from "../app/settings/SettingsPage";

const RedirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage />;
};

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<RedirectIfAuthenticated />} />
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/preview" element={<PreviewPage />} />
          <Route path="/admin/contact-forms" element={<ContactFormPage />} />
          <Route path="/admin/home" element={<HomePage />} />
          <Route path="/admin/aboutme" element={<AboutMePage />} />
          <Route path="/admin/portfolio" element={<PortfolioPage />} />
          <Route path="/admin/projects" element={<ProjectsPage />} />
          <Route path="/admin/contact" element={<ContactPage />} />
          <Route path="/admin/skills" element={<SkillPage />} />
          <Route
            path="/admin/skill-categories"
            element={<SkillCategoryPage />}
          />
          <Route
            path="/admin/work-experiences"
            element={<WorkExperiencePage />}
          />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
