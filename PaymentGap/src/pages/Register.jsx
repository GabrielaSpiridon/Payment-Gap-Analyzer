import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  // Funcție pentru gestionarea trimiterii formularului
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      username: username,
      password: password,
      role: role
    };

    try {
      const response = await axios.post('http://localhost:3000/auth/register', requestBody);
      alert(`User registered successfully! User ID: ${response.data.userId}`);
      navigate('/login'); // Redirecționează către login după înregistrare
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Register</h2>
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
          <div className="mb-3">
            <select 
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button className="btn btn-primary w-100" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;