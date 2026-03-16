import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import PortfolioBuilderPage from "./pages/PortfolioBuilderPage";
import PlansPage from "./pages/PlansPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-area">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/builder" element={<PortfolioBuilderPage />} />
            <Route path="/builder/:id" element={<PortfolioBuilderPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
