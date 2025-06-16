import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, MenuItem, Button } from '@mui/material';
import { Password } from 'primereact/password';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('hr');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/register', { username, password, role });
      alert(`User registered successfully! User ID: ${res.data.userId}`);
      navigate('/login');
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={3} align="center">Înregistrare cont nou</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />
          <Box mt={2} mb={2}>
            <Password
              feedback={false}
              toggleMask
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolă"
              className="w-full"
              inputStyle={{ width: '100%' }}
            />
          </Box>
          <TextField
            fullWidth
            select
            label="Rol"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="normal"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </TextField>
          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">Înregistrează</Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;
