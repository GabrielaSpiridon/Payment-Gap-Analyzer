import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Modal, Paper } from '@mui/material';
import { Password } from 'primereact/password';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('userId', res.data.userId);
        onLoginSuccess();
        navigate('/dashboard');
      } else alert('Invalid credentials');
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await axios.post('http://localhost:3000/auth/reset-password', {
        username: resetUsername,
        newPassword: newPassword,
      });
      if (res.data.success) {
        alert('Password reset successful!');
        setOpen(false);
      } else alert(res.data.message);
    } catch {
      alert('Reset failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={3} align="center">Autentificare</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Password feedback={false} toggleMask value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full" inputStyle={{ width: '100%' }} />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">Login</Button>
          <Button fullWidth variant="outlined" sx={{ mt: 1 }} onClick={() => navigate('/register')}>Register</Button>
          <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={() => setOpen(true)}>Forgot Password?</Button>
        </form>
      </Paper>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24 }}>
          <Typography variant="h6" mb={2}>Resetare parolă</Typography>
          <TextField fullWidth label="Username" value={resetUsername} onChange={(e) => setResetUsername(e.target.value)} sx={{ mb: 2 }} />
          <Password feedback={false} toggleMask value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Parolă nouă" className="w-full" inputStyle={{ width: '100%' }} />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleResetPassword}>Resetează</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Login;
