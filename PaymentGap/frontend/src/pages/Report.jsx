import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import GenderPayGapTrendsChart from '../components/GenderPayGapTrendsChart';

export default function ReportPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/company-details/')    // sau folosește proxy și '/api/...'
      .then(res => {
        setCompany(res.data);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="error">Error loading company details: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Company Details
        </Typography>
        <Typography><strong>Name:</strong> {company.company_name}</Typography>
        <Typography><strong>Region:</strong> {company.region}</Typography>
        <Typography><strong>Country:</strong> {company.country}</Typography>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="outlined" size="small" onClick={() => navigate('/')}>
            Back
          </Button>
        </Box>
      </Paper>

    </Box>
  );
}
