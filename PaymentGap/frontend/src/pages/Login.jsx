import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Modal, Paper } from '@mui/material';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  const showToast = (severity, summary, detail) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('email', username);
        onLoginSuccess();
        navigate('/dashboard');
      } else {
        showToast('error', 'Login failed', 'Invalid credentials');
      }
    } catch (err) {
      showToast('error', 'Login error', err.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await axios.post('http://localhost:3000/auth/reset-password', {
        username: resetUsername,
        newPassword: newPassword,
      });
      if (res.data.success) {
        showToast('success', 'Success', 'Password has been reset');
        setOpen(false);
      } else {
        showToast('error', 'Reset failed', res.data.message);
      }
    } catch {
      showToast('error', 'Reset error', 'Server error');
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
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          width: '100%',
          maxWidth: 420,
          mx: 'auto',
        }}
      >
        <Typography variant="h5" mb={3} align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Login
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
          <Box mt={2} mb={1}>
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
          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
            Login
          </Button>
          <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => navigate('/register')}>
            Don't have an account? Register
          </Button>
          <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={() => setOpen(true)}>
            Forgot your password?
          </Button>
        </form>
      </Paper>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Reset password
          </Typography>
          <TextField
            fullWidth
            label="Email"
            value={resetUsername}
            onChange={(e) => setResetUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Password
            feedback={false}
            toggleMask
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full"
            inputStyle={{ width: '100%', padding: '16.5px 14px' }}
            style={{ width: '100%' }}
          />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleResetPassword}>
            Reset
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Login;
