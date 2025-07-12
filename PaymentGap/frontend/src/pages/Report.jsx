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
import SalaryGenderJobTitleBarChart from '../components/SalaryGenderJobTitleBarChart';
import GenderPieChart from '../components/GenderPieChart';

export default function ReportPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [alerts, setAlerts] = useState([]);
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
      .get('http://localhost:8000/api/company-details/')
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

  const [genderAlert, setGenderAlert] = useState(null);
  const [loadingGenderAlert, setLoadingGenderAlert] = useState(true);
  const [errorGenderAlert, setErrorGenderAlert] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/gender-distribution-alerts/')
      .then(res => setGenderAlert(res.data))
      .catch(err => setErrorGenderAlert(err.message))
      .finally(() => setLoadingGenderAlert(false));
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

  // Funcție pentru print
  const handlePrint = () => {
    window.print();
  };

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

        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Employees Gender Distribution
          </Typography>
          <GenderPieChart />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Gender Distribution Info
          </Typography>

          {loadingGenderAlert ? (
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          ) : errorGenderAlert ? (
            <Alert severity="error">Error loading alert: {errorGenderAlert}</Alert>
          ) : !genderAlert ? (
            <Typography>Balanced distribution (±5%).</Typography>
          ) : (
            <Alert severity="warning">
              {genderAlert.minority === 'Female'
                ? `Women are in the minority by ${genderAlert.diff_pct}% compared to men.`
                : `Men are in the minority by ${genderAlert.diff_pct}% compared to women.`}{' '}
              Please explain the difference.
            </Alert>
          )}
        </Paper>

        {/* Alerts Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <SalaryGenderJobTitleBarChart />
          <Typography variant="h5" gutterBottom>
            Job Title Salary Alerts
          </Typography>

          {loadingAlerts ? (
            <Box sx={{ textAlign: 'center', my: 2 }}><CircularProgress /></Box>
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

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" size="small" onClick={() => navigate('/')}>
            Back to Home Page
          </Button>
          {/* <Button variant="contained" size="small" onClick={handlePrint}>
            Print Page
          </Button> */}
        </Box>
      </Paper>
    </Box>
  );
}
