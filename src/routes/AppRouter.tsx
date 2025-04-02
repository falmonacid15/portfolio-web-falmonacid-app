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
          <Route path="/admin/contact-forms" element={<ContactFormPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
