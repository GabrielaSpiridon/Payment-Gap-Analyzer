
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <AppBar position="static" sx={{ bgcolor: 'white', color: 'black' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
          Payment Gap Analyzer
        </Typography>

        <Box>
          {!isAuthenticated ? (
            <>
              <Button component={Link} to="/login" color="primary" variant="outlined" sx={{ mr: 1 }}>
                Login
              </Button>
              <Button component={Link} to="/register" color="secondary" variant="outlined">
                Register
              </Button>
            </>
          ) : (
            <Button onClick={onLogout} color="error" variant="outlined">
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
