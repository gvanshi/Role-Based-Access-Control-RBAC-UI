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

// Interceptor for logging and error handling (optional)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

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

export const createUser = async (data) => {
  try {
    const response = await API.post('/users', data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await API.put(`/users/${id}`, data);
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

export const createRole = async (data) => {
  try {
    const response = await API.post('/roles', data);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await API.delete(`/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const updateRole = async (id, data) => {
  try {
    const response = await API.put(`/roles/${id}`, data);
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

export const createPermission = async (data) => {
  try {
    const response = await API.post('/permissions', data);
    return response.data;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

export const deletePermission = async (id) => {
  try {
    const response = await API.delete(`/permissions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
};

export const updatePermission = async (id, data) => {
  try {
    const response = await API.put(`/permissions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
};


// Export the configured Axios instance
export default API;
