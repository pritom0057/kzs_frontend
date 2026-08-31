import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import RegistrationPage from './pages/RegistrationPage';
import DirectoryPage from './pages/DirectoryPage';
import AlumniProfileViewPage from './pages/AlumniProfileViewPage';
import PublicStatsPage from './pages/PublicStatsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';

const App = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"      element={<LandingPage />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/stats"  element={<PublicStatsPage />} />

          {/* Authenticated alumni */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard"      element={<DashboardPage />} />
            <Route path="/profile"        element={<ProfilePage />} />
            <Route path="/register-event" element={<RegistrationPage />} />
            <Route path="/directory"      element={<DirectoryPage />} />
            <Route path="/directory/:userId" element={<AlumniProfileViewPage />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin"                   element={<AdminDashboardPage />} />
              <Route path="/admin/users"             element={<AdminUsersPage />} />
              <Route path="/admin/users/:id"         element={<AdminUserDetailPage />} />
              <Route path="/admin/registrations"     element={<AdminRegistrationsPage />} />
            </Route>
          </Route>
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

export default App;
