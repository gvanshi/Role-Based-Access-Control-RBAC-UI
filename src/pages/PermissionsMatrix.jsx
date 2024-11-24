import React, { useEffect, useState } from 'react';
import { getRoles, getPermissions, updateRole } from '../services/api';
import './PermissionsMatrix.css';

const PermissionMatrix = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch roles and permissions on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesData = await getRoles();
        const permissionsData = await getPermissions();
        setRoles(rolesData);
        setPermissions(permissionsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle a specific permission for a role
  const togglePermission = async (roleId, permissionId) => {
    const role = roles.find((r) => r.id === roleId);
    const hasPermission = role.permissions.includes(permissionId);

    const updatedPermissions = hasPermission
      ? role.permissions.filter((p) => p !== permissionId) // Remove permission
      : [...role.permissions, permissionId]; // Add permission

    try {
      await updateRole(roleId, { ...role, permissions: updatedPermissions });
      setRoles((prevRoles) =>
        prevRoles.map((r) =>
          r.id === roleId ? { ...r, permissions: updatedPermissions } : r
        )
      );
      setSuccessMessage('Permission updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    } catch (err) {
      console.error('Error updating permissions:', err);
      setError('Failed to update permissions. Please try again.');
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    }
  };

  // Show loading state
  if (loading) return <div className="loading-indicator">Loading Permission Matrix...</div>;

  // Show error message if fetching data failed
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="permission-matrix-container">
      <h1>Permission Matrix</h1>

      {/* Show success message */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <table className="permission-matrix">
        <thead>
          <tr>
            <th>Role</th>
            {permissions.map((permission) => (
              <th key={permission.id}>{permission.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              {permissions.map((permission) => (
                <td key={permission.id}>
                  <input
                    type="checkbox"
                    checked={role.permissions.includes(permission.id)}
                    onChange={() => togglePermission(role.id, permission.id)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionMatrix;
