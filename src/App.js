import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import ActivityLogs from './pages/ActivityLogs'; // Import Activity Logs Page
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useState } from 'react';
import PermissionMatrix from './pages/PermissionsMatrix';

const App = () => {
  // State to manage authentication status and user role
  const [auth, setAuth] = useState(false);
  const [userRole, setUserRole] = useState(''); // Role can be 'Admin', 'Editor', or 'Viewer'
  const [triggerRefresh, setTriggerRefresh] = useState(0);

  // Call this function whenever you perform an action that affects logs
  const handleAction = async () => {
    // Example: Add a new log
    await fetch('http://localhost:3001/activityLogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: 'Admin',
        action: 'Performed an action',
        timestamp: new Date().toISOString(),
      }),
    });
  
    // Trigger refresh in ActivityLogs component
    setTriggerRefresh((prev) => prev + 1);
  };
  
  // Render ActivityLogs with triggerRefresh
  <ActivityLogs triggerRefresh={triggerRefresh} />;
  return (
    <Router>
      <div className="app">
        {/* Sidebar is only visible after login */}
        {auth && <Sidebar role={userRole} />}
        <div className="main-content">
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
            {/* Activity Logs Page - Accessible to Admin Only */}
            <Route
              path="/activity-logs"
              element={
                <ProtectedRoute
                  auth={auth}
                  role={userRole}
                  allowedRoles={['Admin']}
                >
                  <ActivityLogs />
                </ProtectedRoute>
              }
            />
            {/* Redirect to Login if no matching route */}
            <Route
              path="*"
              element={<Navigate to={auth ? '/users' : '/login'} />}
            />
            <Route
  path="/permission-matrix"
  element={
    <ProtectedRoute
      auth={auth}
      role={userRole}
      allowedRoles={['Admin']}
    >
      <PermissionMatrix />
    </ProtectedRoute>
  }
/>

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
