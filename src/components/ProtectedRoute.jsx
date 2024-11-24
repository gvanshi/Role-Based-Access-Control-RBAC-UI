import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - A component to enforce role-based access control
 * @param {boolean} auth - Indicates if the user is authenticated
 * @param {string} role - The role of the currently logged-in user
 * @param {array} allowedRoles - List of roles allowed to access the route
 * @param {ReactNode} children - The child components to render if access is granted
 */
const ProtectedRoute = ({ auth, role, allowedRoles = [], children }) => {
  // Redirect to login if the user is not authenticated
  if (!auth) {
    return <Navigate to="/login" />;
  }

  // Show "Access Denied" message if the user's role is not allowed
  if (!allowedRoles.includes(role)) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // Render the child components if access is granted
  return children;
};

export default ProtectedRoute;
