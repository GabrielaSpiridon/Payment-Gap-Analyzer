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
      showToast('success', 'Success', `User registered! `);
      navigate('/login');
    } catch (err) {
      const status = err.response?.status;
    // dacă back-end trimite 409 pentru username existent
    if (status === 500) {
      showToast('error', 'Registration failed', 'This email is already registered.');
    }
    else {
      // altfel arătăm mesajul generic sau cel venit de la server
      const detail = err.response?.data?.message || err.message;
      showToast('error', 'Registration failed', detail);
    }
  }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        /* fundal radial gradient spre margini */
        background: 'radial-gradient(circle at center, #ffffff 0%, #e3f2fd 60%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2
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
            label="Email"
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
                required
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
            required
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </TextField>
          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
            Register
          </Button>
          <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => navigate('/login')}>
                        Back to Login
                      </Button>
          
        </form>
      </Paper>
    </Box>
  );
}

export default Register;
