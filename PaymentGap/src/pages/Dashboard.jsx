import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.log('No userId provided. Redirecting to login.');
      navigate('/login');
    }
  }, [userId, navigate]);

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <p>Welcome, User ID: {userId}</p>
      <button
        className="btn btn-danger"
        onClick={() => {
          localStorage.removeItem('authenticated');
          localStorage.removeItem('userId');
          navigate('/login');
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;