import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifică starea de autentificare la încărcarea componentei
  useEffect(() => {
    const storedAuth = localStorage.getItem('authenticated');
    const storedUserId = localStorage.getItem('userId');
    if (storedAuth === 'true' && storedUserId) {
      setIsAuthenticated(true);
    }
  }, []);

  // Funcție pentru gestionarea autentificării cu succes
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('authenticated', 'true');
  };

  // Funcție pentru delogare
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authenticated');
    localStorage.removeItem('userId'); // Șterge userId la delogare
  };

  return (
    <Router>
      <div className="App">
        {/* Butoane de navigare globale */}
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid">
            <Link to="/login" className="navbar-brand">My App</Link>
            <div>
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                  <Link to="/register" className="btn btn-outline-secondary">Register</Link>
                </>
              )}
              {isAuthenticated && (
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          {/* Ruta implicită - redirecționează către login sau dashboard */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          {/* Ruta pentru login */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Ruta pentru înregistrare */}
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
          />

          {/* Ruta pentru dashboard */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;