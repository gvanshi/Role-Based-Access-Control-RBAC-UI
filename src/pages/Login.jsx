import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth, setUserRole }) => {
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Fetch users from the backend or mock JSON server
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();

      // Find a user with matching email and password
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        // Set authentication and user role in the parent state
        setAuth(true);
        setUserRole(user.role);
        alert(`Login successful! Welcome, ${user.name}.`);

        // Redirect based on role
        if (user.role === 'Admin') {
          navigate('/users'); // Admin goes to User Management
        } else if (user.role === 'Editor') {
          navigate('/roles'); // Editor goes to Role Management
        } else if (user.role === 'Viewer') {
          navigate('/users'); // Viewer sees User View-Only
        }
      } else {
        alert('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
