import React, { useState, useEffect } from 'react';
import { getPermissions, createPermission, deletePermission, updatePermission } from '../services/api';
import './Permissions.css';

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Fetch permissions from the API
  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();
      setPermissions(response || []);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError('Failed to fetch permissions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new permission
  const handleAddPermission = async (e) => {
    e.preventDefault();
    if (!newPermission.trim()) {
      alert('Permission name cannot be empty!');
      return;
    }
    if (permissions.some((perm) => perm.name.toLowerCase() === newPermission.toLowerCase())) {
      alert('Permission already exists!');
      return;
    }

    try {
      await createPermission({ name: newPermission });
      setNewPermission('');
      fetchPermissions();
    } catch (err) {
      console.error('Error adding permission:', err);
      setError('Failed to add permission. Please try again later.');
    }
  };

  // Delete a permission
  const handleDeletePermission = async (id) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await deletePermission(id);
        fetchPermissions();
      } catch (err) {
        console.error('Error deleting permission:', err);
        setError('Failed to delete permission. Please try again later.');
      }
    }
  };

  // Edit permission name
  const handleEditPermission = async (e) => {
    e.preventDefault();
    if (!editingName.trim()) {
      alert('Permission name cannot be empty!');
      return;
    }
    if (permissions.some((perm) => perm.name.toLowerCase() === editingName.toLowerCase())) {
      alert('Permission already exists!');
      return;
    }

    try {
      await updatePermission(editingId, { name: editingName });
      setEditingId(null);
      setEditingName('');
      fetchPermissions();
    } catch (err) {
      console.error('Error editing permission:', err);
      setError('Failed to edit permission. Please try again later.');
    }
  };

  // Filtered permissions based on search query
  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p className="loading">Loading permissions...</p>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="permissions-container">
      <h1 className="title">Permissions Management</h1>

      {/* Add Permission Form */}
      <form className="permissions-form" onSubmit={handleAddPermission}>
        <input
          type="text"
          placeholder="Enter new permission"
          value={newPermission}
          onChange={(e) => setNewPermission(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="add-button">
          Add Permission
        </button>
      </form>

      {/* Search Permissions */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search permissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
        />
      </div>

      {/* Permissions List */}
      <ul className="permissions-list">
        {filteredPermissions.map((permission) => (
          <li key={permission.id} className="permission-item">
            {editingId === permission.id ? (
              <form onSubmit={handleEditPermission}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="form-input"
                />
                <button type="submit" className="edit-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setEditingId(null);
                    setEditingName('');
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <span className="permission-name">{permission.name}</span>
                <button
                  onClick={() => {
                    setEditingId(permission.id);
                    setEditingName(permission.name);
                  }}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePermission(permission.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Permissions;
