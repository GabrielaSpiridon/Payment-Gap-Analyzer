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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import GenderPayGapTrendsChart from '../components/GenderPayGapTrendsChart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Card } from 'primereact/card';   
import SalaryGenderJobTitleBarChart from '../components/SalaryGenderJobTitleBarChart';

export default function ReportPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const [alerts, setAlerts]           = useState([]);
    const [loadingAlerts, setLoadingAlerts] = useState(true);
    const [errorAlerts, setErrorAlerts] = useState(null);

    useEffect(() => {
     axios
        .get('http://localhost:8000/api/job-title-salary-alerts/')
        .then(res => setAlerts(res.data))
        .catch(err => setErrorAlerts(err.message))
        .finally(() => setLoadingAlerts(false));
    }, []);


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
       {/* Chart Section */}
<Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
  <Typography variant="h5" gutterBottom>
    Gender Pay Gap Trend
  </Typography>
  <GenderPayGapTrendsChart />
</Paper>

{/* Alerts Section */}
<Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
    <SalaryGenderJobTitleBarChart />
  <Typography variant="h5" gutterBottom>
    Job Title Salary Alerts
  </Typography>

  {loadingAlerts ? (
    <Box sx={{ textAlign: 'center', my: 2 }}><CircularProgress/></Box>
  ) : errorAlerts ? (
    <Alert severity="error">Error loading alerts: {errorAlerts}</Alert>
  ) : alerts.length === 0 ? (
    <Typography>No salary alerts. All within ±5%.</Typography>
  ) : (
    alerts.map(alert => (
        <Box
        key={alert.job_title}
        sx={{
          border: 1,
          borderColor: 'error.main',
          borderRadius: 1,
          p: 2,
          mb: 2,
        }}
      >
        {/* Textul de atenționare apare doar aici, odată cu prima alertă */}
        <Typography sx={{ mb: 1 }}>
          For job title <strong>{alert.job_title}</strong>, we have salary differences between genders. Review the following employees:
        </Typography>

        <List>
          {alert.employees_below_avg.map(emp => (
            <ListItem key={emp.id} disableGutters>
              <ListItemIcon>
                <WarningAmberIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary={emp.name}
                secondary={`Salary: ${emp.salary} RON`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    ))
  )}
</Paper>

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button variant="outlined" size="small" onClick={() => navigate('/')}>
            Back to Home Page
          </Button>
        </Box>
      </Paper>

    </Box>
  );
}
