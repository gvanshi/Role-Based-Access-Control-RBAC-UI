import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import './Users.css';

const Users = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortKey, setSortKey] = useState('id');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Viewer',
    status: 'Active',
  });
  const [passwordStrength, setPasswordStrength] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply search, filter, and sort
  useEffect(() => {
    let result = users;

    if (filterStatus) {
      result = result.filter((user) => user.status === filterStatus);
    }

    if (searchTerm) {
      result = result.filter((user) =>
        `${user.name} ${user.email} ${user.role}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    result = [...result].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return -1;
      if (a[sortKey] > b[sortKey]) return 1;
      return 0;
    });

    setFilteredUsers(result);
  }, [users, searchTerm, filterStatus, sortKey]);

  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    const strength =
      Object.values(rules).filter(Boolean).length <= 2
        ? 'Weak'
        : Object.values(rules).filter(Boolean).length === 3
        ? 'Medium'
        : 'Strong';
    setPasswordStrength({ ...rules, strength });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') validatePassword(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert('Name, Email, and Password are required.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      if (formData.id && users.some((user) => user.id === formData.id)) {
        await updateUser(formData.id, formData);
        setUsers(users.map((user) => (user.id === formData.id ? { ...user, ...formData } : user)));
        alert('User updated successfully!');
      } else {
        const newUser = await createUser(formData);
        setUsers([...users, newUser]);
        alert('User added successfully!');
      }

      setFormData({
        id: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Viewer',
        status: 'Active',
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  const handleEditClick = (user) => {
    setFormData({ ...user, password: '', confirmPassword: '' });
    setShowForm(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        alert('User deleted successfully!');
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  return (
    <div className="users-container">
      <h1 className="title">Users Management</h1>

      {/* Search, Filter, and Sort Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by Name, Email, or Role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Filter by Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="sort-select"
        >
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            {role === 'Admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              {role === 'Admin' && (
                <td>
                  <button className="edit-button" onClick={() => handleEditClick(user)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {role === 'Admin' && (
        <button className="add-user-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'Add New User'}
        </button>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{formData.id ? 'Update User' : 'Add New User'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div>
                <label>ID</label>
                <input
                  type="number"
                  placeholder="ID"
                  name="id"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="password-validation">
                <span className={passwordStrength.length ? 'valid' : 'invalid'}>At least 8 characters</span>
                <span className={passwordStrength.uppercase ? 'valid' : 'invalid'}>At least 1 uppercase letter</span>
                <span className={passwordStrength.number ? 'valid' : 'invalid'}>At least 1 number</span>
                <span className={passwordStrength.special ? 'valid' : 'invalid'}>At least 1 special character</span>
                <span className="password-strength">Password Strength: {passwordStrength.strength}</span>
              </div>
              <div>
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="radio-group">
                <label>Status:</label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                  Active
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  />
                  Inactive
                </label>
              </div>
              <div className="modal-buttons">
                <button type="submit">{formData.id ? 'Update User' : 'Add User'}</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
