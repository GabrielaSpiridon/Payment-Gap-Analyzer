import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, MenuItem, Button } from '@mui/material';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('hr');
  const navigate = useNavigate();
  const toast = useRef(null);

  const showToast = (severity, summary, detail) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/register', { username, password, role });
      showToast('success', 'Success', `User registered! ID: ${res.data.userId}`);
      navigate('/login');
    } catch (err) {
      showToast('error', 'Registration failed', err.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(to right, #e3f2fd, #cfd8dc)',
        px: 2,
      }}
    >
      <Toast ref={toast} />
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, width: '100%', maxWidth: 420 }}>
        <Typography variant="h5" mb={3} align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Create Account
        </Typography>
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
            <Box sx={{ width: '100%' }}>
              <Password
                feedback={false}
                toggleMask
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                inputStyle={{ width: '100%', padding: '16.5px 14px' }}
                style={{ width: '100%' }}
              />
            </Box>
          </Box>
          <TextField
            fullWidth
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="normal"
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </TextField>
          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;
