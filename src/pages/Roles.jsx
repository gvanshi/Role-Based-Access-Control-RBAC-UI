import React, { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '../services/api';
import './Roles.css';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    roleName: '',
    permissions: [],
  });
  const [error, setError] = useState('');

  // Fetch roles from the API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
        setFilteredRoles(data);
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };

    fetchRoles();
  }, []);

  // Search functionality
  useEffect(() => {
    const results = roles.filter(
      (role) =>
        role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.permissions.some((perm) =>
          perm.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredRoles(results);
  }, [searchTerm, roles]);

  // Sort functionality
  const handleSort = () => {
    const sortedRoles = [...filteredRoles].sort((a, b) => {
      const comparison = a.roleName.localeCompare(b.roleName);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    setFilteredRoles(sortedRoles);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id || !formData.roleName) {
      setError('Role ID and Role Name are required!');
      return;
    }

    if (roles.some((role) => role.id === formData.id)) {
      setError('Role ID must be unique!');
      return;
    }

    setError('');
    try {
      if (roles.some((role) => role.id === formData.id)) {
        // Update existing role
        await updateRole(formData.id, formData);
        setRoles((prev) =>
          prev.map((role) =>
            role.id === formData.id ? { ...role, ...formData } : role
          )
        );
      } else {
        // Create new role
        await createRole(formData);
        setRoles((prev) => [...prev, formData]);
      }
      setFormData({ id: '', roleName: '', permissions: [] });
      setShowForm(false);
    } catch (err) {
      console.error('Error saving role:', err);
    }
  };

  // Handle permission selection
  const handlePermissionChange = (permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((perm) => perm !== permission)
        : [...prev.permissions, permission],
    }));
  };

  // Edit role
  const handleEditClick = (role) => {
    setFormData(role);
    setShowForm(true);
  };

  // Delete role
  const handleDeleteRole = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(id);
        setRoles((prev) => prev.filter((role) => role.id !== id));
      } catch (err) {
        console.error('Error deleting role:', err);
      }
    }
  };

  return (
    <div className="roles-container">
      <h1 className="title">Roles Management</h1>

      {/* Search and Sort Controls */}
      <div className="controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search roles or permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="sort-button" onClick={handleSort}>
          Sort by Name ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
        </button>
        <button className="add-role-button" onClick={() => setShowForm(true)}>
          Add New Role
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{formData.id ? 'Update Role' : 'Add New Role'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="roleId">Role ID</label>
                <input
                  id="roleId"
                  type="text"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  placeholder="Enter Role ID"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="roleName">Role Name</label>
                <input
                  id="roleName"
                  type="text"
                  value={formData.roleName}
                  onChange={(e) =>
                    setFormData({ ...formData, roleName: e.target.value })
                  }
                  placeholder="Enter Role Name"
                  required
                />
              </div>
              <fieldset>
                <legend>Permissions</legend>
                {['Read', 'Write', 'Delete'].map((permission) => (
                  <label key={permission} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                    />
                    {permission}
                  </label>
                ))}
              </fieldset>
              {error && <div className="error">{error}</div>}
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {formData.id ? 'Update Role' : 'Add Role'}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Roles Table */}
      <table className="roles-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Role Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.roleName}</td>
              <td>{role.permissions.join(', ')}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(role)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Roles;
