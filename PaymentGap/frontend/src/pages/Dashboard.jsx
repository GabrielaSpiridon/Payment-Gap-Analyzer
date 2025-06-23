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

function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  const [employeeName, setEmployeeName] = useState('');
  const [loadingName, setLoadingName] = useState(true);

  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
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

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setResults([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    setUploading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/upload-excel/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const responseResults = res.data.results || [];
      setResults(responseResults);

      const allSuccessful = responseResults.every((r) => r.status === 'success');
      setSnackbar({
        open: true,
        message: allSuccessful ? 'All files uploaded successfully!' : 'Some files failed to upload.',
        severity: allSuccessful ? 'success' : 'warning',
      });
    } catch (err) {
      console.error('Upload error:', err);
      setResults(files.map((f) => ({ fileName: f.name, status: 'failed', message: 'Server error' })));
      setSnackbar({
        open: true,
        message: 'Upload failed due to server error.',
        severity: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const retryFailed = () => {
    const failedFiles = files.filter((file) =>
      results.find((r) => r.fileName === file.name && r.status === 'failed')
    );
    setFiles(failedFiles);
    setResults([]);
  };

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

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" mb={1}>
          Import multiple Excel files
        </Typography>

        <InputLabel htmlFor="upload-excel" sx={{ mb: 1 }}>
          Select one or more Excel files (.xlsx, .xls)
        </InputLabel>
        <input
          multiple
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          id="upload-excel"
          style={{ marginBottom: '16px' }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
        >
          {uploading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Upload files'}
        </Button>

        {results.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" mb={1}>Upload results:</Typography>
            <List dense>
              {results.map((r, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    {r.status === 'success' ? (
                      <CheckCircle color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={r.fileName}
                    secondary={r.status === 'success' ? 'Upload successful' : `Failed: ${r.message}`}
                  />
                </ListItem>
              ))}
            </List>

            {results.some((r) => r.status === 'failed') && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Some files failed to upload. You can retry them.
                <Button size="small" sx={{ ml: 2 }} onClick={retryFailed}>
                  Retry failed
                </Button>
              </Alert>
            )}
          </Box>
        )}

        <Divider sx={{ my: 4 }} />
        
        <GenderPieChart />

        <SalaryGenderDepartmentBarChart />
        
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
