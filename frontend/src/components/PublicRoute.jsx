import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      const userRole = user.role || 'student';

      // Redirect to appropriate dashboard based on role
      if (userRole === 'admin' || userRole === 'warden') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return children;
};

export default PublicRoute;
