import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setAuth, setUserRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();

      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        setAuth(true);
        setUserRole(user.role);
        alert(`Login successful! Welcome, ${user.name}.`);

        if (user.role === 'Admin') {
          navigate('/users');
        } else if (user.role === 'Editor') {
          navigate('/roles');
        } else if (user.role === 'Viewer') {
          navigate('/users');
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
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
