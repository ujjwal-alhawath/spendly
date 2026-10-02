import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export const ProtectedRoute = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
