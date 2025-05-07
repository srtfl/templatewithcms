import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../App';

function ProtectedRoute({ children }) {
  const { user, isAdmin } = useAuth();
  console.log('ProtectedRoute called: user=', user?.email || 'null', 'isAdmin=', isAdmin);

  if (!user) {
    console.log('ProtectedRoute: Redirecting to /login (no user)');
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    console.log('ProtectedRoute: Redirecting to / (not admin)');
    return <Navigate to="/" />;
  }

  console.log('ProtectedRoute: Allowing access to route');
  return children;
}

export default ProtectedRoute;