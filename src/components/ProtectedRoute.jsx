import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// General protected route - just requires login
export default function ProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Route only for employers
export function EmployerRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'employer') {
    return <Navigate to="/jobseeker" replace />;
  }

  return <Outlet />;
}

// Route only for jobseekers
export function JobseekerRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'jobseeker') {
    return <Navigate to="/vacancies" replace />;
  }

  return <Outlet />;
}

// Route only for admins
export function AdminRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
