import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);

    // Check if role is required and matches
    if (requiredRole) {
      const userRole = user.role || 'student';

      if (Array.isArray(requiredRole)) {
        if (!requiredRole.includes(userRole)) {
          return <Navigate to="/dashboard" replace />;
        }
      } else if (userRole !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
      }
    }

    return children;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
