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
import WorkforceCompositionChart from '../components/WorkforceCompositionChart'; // Assuming you have this component

function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  const [employeeName, setEmployeeName] = useState('');
  const [loadingName, setLoadingName] = useState(true);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  useEffect(() => {
    async function fetchName() {
      if (!email) {
        setEmployeeName('');
        setLoadingName(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:3000/employees/getEmployeeByEmail?email=${encodeURIComponent(email)}`);
        if (res.data && res.data.first_name && res.data.second_name) {
          setEmployeeName(`${res.data.first_name} ${res.data.second_name}`);
        } else {
          setEmployeeName(email);
        }
      } catch (err) {
        setEmployeeName(email);
      } finally {
        setLoadingName(false);
      }
    }
    fetchName();
  }, [email]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto', borderRadius: 3 }}>
        <Typography variant="h4" mb={2} fontWeight="bold" color="primary">
          Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {loadingName ? "Loading..." : <>Welcome, <b>{employeeName || email}</b>!</>}
        </Typography>

      

        <Divider sx={{ my: 4 }} />
        
        <WorkforceCompositionChart />

        <SalaryTrendByMonth />

        <AgeBarChart />

        <SalaryGenderSeniorityBarChart />

        <GenderPieChart />

        <SalaryGenderDepartmentBarChart />

        <SalaryYearLineChart />
        
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            localStorage.removeItem('authenticated');
            localStorage.removeItem('userId');
            localStorage.removeItem('fullName');
            navigate('/login');
          }}
        >
          Logout
        </Button>
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

export default Dashboard;
