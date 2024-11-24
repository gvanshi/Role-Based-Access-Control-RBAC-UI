import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ auth, role, allowedRoles, children }) => {
  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Access Denied</div>;
  }

  return children;
};

export default ProtectedRoute;
