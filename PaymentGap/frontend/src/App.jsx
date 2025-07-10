import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar'; 
import ImportExcelPage from './pages/ImportExcelPage';
import Employees from './pages/Employees';
import HomePage from './pages/Homepage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('authenticated');
    const storedUserId = localStorage.getItem('userId');
    if (storedAuth === 'true' && storedUserId) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userId');
  };

  return (
    <Router>
      <Box>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/homepage" /> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/homepage" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/homepage" /> : <Register />} />
          <Route path="/homepage" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/import" element={isAuthenticated ? <ImportExcelPage /> : <Navigate to="/login" />} />
          <Route path="/employees" element={isAuthenticated ? <Employees /> : <Navigate to="/login" />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
