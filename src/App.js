import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useState } from 'react';

const App = () => {
  // State to manage authentication status and user role
  const [auth, setAuth] = useState(false);
  const [userRole, setUserRole] = useState(''); // Role can be 'Admin', 'Editor', or 'Viewer'

  return (
    <Router>
      <div className="app">
        {/* Sidebar is only visible after login */}
        {auth && <Sidebar role={userRole} />}
        <Routes>
          {/* Login Page */}
          <Route
            path="/login"
            element={<Login setAuth={setAuth} setUserRole={setUserRole} />}
          />
          {/* Users Page - Accessible to Admin and Viewer */}
          <Route
            path="/users"
            element={
              <ProtectedRoute
                auth={auth}
                role={userRole}
                allowedRoles={['Admin', 'Viewer']}
              >
                <Users role={userRole} />
              </ProtectedRoute>
            }
          />
          {/* Roles Page - Accessible to Admin and Editor */}
          <Route
            path="/roles"
            element={
              <ProtectedRoute
                auth={auth}
                role={userRole}
                allowedRoles={['Admin', 'Editor']}
              >
                <Roles role={userRole} />
              </ProtectedRoute>
            }
          />
          {/* Permissions Page - Accessible to Admin Only */}
          <Route
            path="/permissions"
            element={
              <ProtectedRoute
                auth={auth}
                role={userRole}
                allowedRoles={['Admin']}
              >
                <Permissions role={userRole} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
