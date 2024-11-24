import axios from 'axios';

// Axios Instance
const API = axios.create({
  baseURL: 'http://localhost:3001', // Replace with your backend server URL
});

// Interceptor to add the user's role to headers
API.interceptors.request.use(
  (config) => {
    const userRole = localStorage.getItem('userRole'); // Fetch role from localStorage
    if (userRole) {
      config.headers['user-role'] = userRole;
    }
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor for logging and error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

//
// Activity Logs API Methods
//
export const getActivityLogs = async () => {
  try {
    const response = await API.get('/activityLogs');
    return response.data;
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    throw error;
  }
};

export const addActivityLog = async (log) => {
  try {
    const response = await API.post('/activityLogs', log);
    return response.data;
  } catch (error) {
    console.error('Error adding activity log:', error);
    throw error;
  }
};

export const logActivity = async (user, action) => {
  try {
    const log = {
      user,
      action,
      timestamp: new Date().toISOString(),
    };
    await addActivityLog(log);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

//
// User Management API Methods
//
export const getUsers = async () => {
  try {
    const response = await API.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (data, currentUser = 'Admin') => {
  try {
    const response = await API.post('/users', data);
    await logActivity(currentUser, 'Added a new user');
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteUser = async (id, currentUser = 'Admin') => {
  try {
    const response = await API.delete(`/users/${id}`);
    await logActivity(currentUser, `Deleted user with ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUser = async (id, data, currentUser = 'Admin') => {
  try {
    const response = await API.put(`/users/${id}`, data);
    await logActivity(currentUser, `Updated user with ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

//
// Role Management API Methods
//
export const getRoles = async () => {
  try {
    const response = await API.get('/roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const createRole = async (data, currentUser = 'Admin') => {
  try {
    const response = await API.post('/roles', data);
    await logActivity(currentUser, `Created a new role: ${data.name}`);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const deleteRole = async (id, currentUser = 'Admin') => {
  try {
    const response = await API.delete(`/roles/${id}`);
    await logActivity(currentUser, `Deleted role with ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const updateRole = async (id, data, currentUser = 'Admin') => {
  try {
    const response = await API.put(`/roles/${id}`, data);
    await logActivity(currentUser, `Updated role with ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

//
// Permission Management API Methods
//
export const getPermissions = async () => {
  try {
    const response = await API.get('/permissions');
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

export const createPermission = async (data, currentUser = 'Admin') => {
  try {
    const response = await API.post('/permissions', data);
    await logActivity(currentUser, `Created a new permission: ${data.name}`);
    return response.data;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

export const deletePermission = async (id, currentUser = 'Admin') => {
  try {
    const response = await API.delete(`/permissions/${id}`);
    await logActivity(currentUser, `Deleted permission with ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
};

export const updatePermission = async (id, data, currentUser = 'Admin') => {
  try {
    const response = await API.put(`/permissions/${id}`, data);
    await logActivity(currentUser, `Updated permission with ID: ${id}`);
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
};

// Export the configured Axios instance
export default API;
