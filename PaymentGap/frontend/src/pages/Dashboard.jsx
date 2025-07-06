import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import axios from 'axios';
import GenderPieChart from '../components/GenderPieChart';
import SalaryGenderDepartmentBarChart from '../components/SalaryGenderDepartmentBarChart';
import SalaryYearLineChart from '../components/SalaryYearLineChart';
import SalaryGenderSeniorityBarChart from '../components/SalaryGenderSeniorityBarChart';
import AgeBarChart from '../components/AgeBarChart';
import SalaryTrendByMonth from '../components/SalaryTrendByMonth';
import WorkforceCompositionChart from '../components/WorkforceCompositionChart';
import SalaryGenderJobTitleBarChart from '../components/SalaryGenderJobTitleBarChart';

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  const [employeeName, setEmployeeName] = useState('');
  const [loadingName, setLoadingName] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (!userId) navigate('/login');
  }, [userId, navigate]);

  useEffect(() => {
    async function fetchName() {
      if (!email) {
        setLoadingName(false);
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:3000/employees/getEmployeeByEmail?email=${encodeURIComponent(email)}`
        );
        const data = res.data;
        if (data?.first_name && data?.second_name) {
          setEmployeeName(`${data.first_name} ${data.second_name}`);
        } else {
          setEmployeeName(email);
        }
      } catch {
        setEmployeeName(email);
      } finally {
        setLoadingName(false);
      }
    }
    fetchName();
  }, [email]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const chartsList = [
    { Chart: SalaryGenderJobTitleBarChart },
    { Chart: WorkforceCompositionChart },
    { Chart: SalaryTrendByMonth },
    { Chart: AgeBarChart },
    { Chart: SalaryGenderSeniorityBarChart },
    { Chart: GenderPieChart },
    { Chart: SalaryGenderDepartmentBarChart },
    { Chart: SalaryYearLineChart },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {loadingName
            ? 'Loading...'
            : (
                <>Welcome, <b>{employeeName || email}</b>!</>
              )}
        </Typography>
        <Divider sx={{ my: 3 }} />

        <Box display="flex" flexWrap="wrap" justifyContent="space-around" gap={2}>
          {chartsList.map(({ title, Chart }, idx) => (
            <Paper
              key={idx}
              elevation={2}
              sx={{ p: 2, width: { xs: '100%', sm: '48%', md: '30%' }, minHeight: 240 }}
            >
             {title === 'Employees Gender Distribution' ? (
                <Box sx={{ width: 150, height: 150, mx: 'auto' }}>
                  <GenderPieChart />
                </Box>
              ) : (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Chart />
                </Box>
              )}
            </Paper>
          ))}
        </Box>

        <Box mt={4} textAlign="center">
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
