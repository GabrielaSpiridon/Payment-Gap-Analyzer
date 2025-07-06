import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Modal, Paper, Alert } from '@mui/material';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [step, setStep] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const toast = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer <= 0) setCanResend(true);
  }, [step, timer]);

  useEffect(() => {
    if (step === 'otp') {
      setTimer(15);
      setCanResend(false);
    }
  }, [step]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/otp/login', { username, password });
      if (res.data.success && res.data.step === 'otp') {
        setStep('otp');
        setSuccess('Check your email! We sent you a code.');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login error');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:3000/otp/verify-otp', { username, code: otp });
      if (res.data.success) {
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('email', username);
        if (onLoginSuccess) onLoginSuccess();
        navigate('/dashboard');
      } else {
        setError(res.data.message || 'Incorrect authentication code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP validation error');
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setTimer(15);
    setCanResend(false);
    try {
      await axios.post('http://localhost:3000/otp/login', { username, password });
      setSuccess('A new code has been sent to your email!');
    } catch {
      setError('Failed to resend code.');
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:3000/auth/reset-password', {
        username: resetUsername,
        newPassword: newPassword,
      });
      if (res.data.success) {
        //setSuccess('Password has been reset');
        toast.current?.show({
        severity: 'success',
        summary: 'Password Reset',
        detail: 'Your password was successfully updated.',
        life: 3000,
      });
        setOpen(false);
        setResetUsername('');
        setNewPassword('');
      } else {
        setError(res.data.message || 'Reset failed');
      }
    } catch {
      setError('Server error');
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
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, width: '100%', maxWidth: 420, mx: 'auto', position: 'relative' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 'bold', border: '2px solid #c62828', background: '#ffebee', color: '#b71c1c', boxShadow: '0 4px 16px rgba(198, 40, 40, 0.12)' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 'bold', border: '2px solid #2e7d32', background: '#e8f5e9', color: '#1b5e20', boxShadow: '0 4px 16px rgba(46, 125, 50, 0.12)' }}>
            {success}
          </Alert>
          )}
        <Typography variant="h5" mb={3} align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {step === 'login' ? 'Login' : 'Enter authentication code'}
        </Typography>

        {step === 'login' ? (
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" required />
            <Box mt={2} mb={1}>
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
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <Typography variant="body2" mb={2}>
              We sent a code to your email address. Please enter it below:
            </Typography>
            <TextField fullWidth label="Authentication Code" value={otp} onChange={(e) => setOtp(e.target.value)} margin="normal" required />
            <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
              Verify Authentication Code
            </Button>
            <Box mt={2} display="flex" alignItems="center" justifyContent="center">
              {!canResend ? (
                <Typography variant="body2" color="text.secondary">
                  You can resend the code in <b>{timer}</b> seconds.
                </Typography>
              ) : (
                <Button variant="outlined" onClick={handleResendCode}>
                  Resend code
                </Button>
              )}
            </Box>
          </form>
        )}
      </Paper>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setResetUsername('');
          setNewPassword('');
        }}
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>
            Reset password
          </Typography>
          <TextField
            fullWidth
            label="Email"
            value={resetUsername}
            onChange={(e) => setResetUsername(e.target.value)}
            sx={{ mb: 2 }}
            required
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
            required
          />
          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleResetPassword} disabled={!resetUsername || !newPassword}>
            Reset
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Login;
