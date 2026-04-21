import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VacancyProvider } from './contexts/VacancyContext';
import ProtectedRoute, { EmployerRoute, JobseekerRoute, AdminRoute } from './components/ProtectedRoute';

// Layouts
import MainLayout from './components/MainLayout';
import JobseekerLayout from './components/JobseekerLayout';

// Public Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Verification from './pages/Verification';
import Settings from './pages/Settings';
import FAQ from './pages/FAQ';
import Contacts from './pages/Contacts';

// Employer Pages
import Vacancies from './pages/Vacancies';
import VacancyForm from './pages/VacancyForm';
import Profile from './pages/Profile';
import Messages from './pages/Messages';

// Jobseeker Pages
import JobseekerDashboard from './pages/jobseeker/JobseekerDashboard';
import JobseekerProfile from './pages/jobseeker/JobseekerProfile';
import JobseekerResume from './pages/jobseeker/JobseekerResume';
import JobseekerVacancyDetail from './pages/jobseeker/JobseekerVacancyDetail';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminVacancies from './pages/admin/AdminVacancies';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminQueries from './pages/admin/AdminQueries';

function App() {
  return (
    <AuthProvider>
      <VacancyProvider>
        <BrowserRouter>
          <div className="font-sans text-gray-800 min-h-screen flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verification" element={<Verification />} />
              {/* Public Job Search & Info */}
              <Route element={<JobseekerLayout />}>
                <Route path="/jobseeker" element={<JobseekerDashboard />} />
                <Route path="/jobseeker/vacancy/:id" element={<JobseekerVacancyDetail />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contacts" element={<Contacts />} />
              </Route>

              {/* ===== EMPLOYER ROUTES ===== */}
              <Route element={<EmployerRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/vacancies" element={<Vacancies />} />
                  <Route path="/vacancies/create" element={<VacancyForm />} />
                  <Route path="/vacancies/:id/edit" element={<VacancyForm />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/messages" element={<Messages />} />
                </Route>
              </Route>

              {/* ===== ADMIN ROUTES ===== */}
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/user/:id" element={<AdminUserDetails />} />
                  <Route path="/admin/vacancies" element={<AdminVacancies />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/queries" element={<AdminQueries />} />
                </Route>
              </Route>

              {/* ===== JOBSEEKER ROUTES ===== */}
              <Route element={<JobseekerRoute />}>
                <Route element={<JobseekerLayout />}>
                  <Route path="/jobseeker/profile" element={<JobseekerProfile />} />
                  <Route path="/jobseeker/resume" element={<JobseekerResume />} />
                  <Route path="/jobseeker/settings" element={<Settings />} />
                  <Route path="/jobseeker/faq" element={<FAQ />} />
                  <Route path="/jobseeker/contacts" element={<Contacts />} />
                  <Route path="/jobseeker/messages" element={<Messages />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </VacancyProvider>
    </AuthProvider>
  );
}

export default App;
