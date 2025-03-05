import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Funcție pentru gestionarea trimiterii formularului
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      username: username,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:3000/auth/login', requestBody);
      const result = response.data;

      if (result.success) {
        alert('Login successful');
        localStorage.setItem('userId', result.userId); // Salvează userId în localStorage
        onLoginSuccess(); // Actualizează starea de autentificare
        navigate('/dashboard'); // Redirecționează către Dashboard
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login to Payment Gap Analyzer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input 
              type="text" 
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              className="form-control"
              required
            />
          </div>
          <button className="btn btn-primary w-100 mb-2" type="submit">Login</button>
          <button 
            className="btn btn-secondary w-100"
            type="button" 
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;