import React, { useState } from 'react';
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

function ImportExcelPage() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

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
        message: allSuccessful ? 'All files were uploaded successfully!' : 'Some files failed to upload.',
        severity: allSuccessful ? 'success' : 'warning',
      });
    } catch (err) {
      let responseResults = [];
      if (err.response && err.response.data && err.response.data.results) {
         responseResults = err.response.data.results;
       } else {
          responseResults = files.map((f) => ({
            fileName: f.name,
            status: 'failed',
            message: 'Network or server error'
        }));
      }
     setResults(responseResults);setSnackbar({
        open: true,
        message: 'Upload failed due to a server error.',
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
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: 3 }}>
        <Typography variant="h4" mb={2} fontWeight="bold" color="primary">
          Import Excel Files
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" mb={1}>
          Select one or more Excel files (.xlsx, .xls)
        </Typography>
        <InputLabel htmlFor="upload-excel" sx={{ mb: 1 }}>
          Choose files
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
          {uploading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Upload Files'}
        </Button>

        {results.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" mb={1}>Import result:</Typography>
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
                    secondary={r.status === 'success' ? 'Import successful' : `Failed: ${r.message}`}
                  />
                </ListItem>
              ))}
            </List>
            {results.some((r) => r.status === 'failed') && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Some files failed to import. You can retry them.
                <Button size="small" sx={{ ml: 2 }} onClick={retryFailed}>
                  Retry failed
                </Button>
              </Alert>
            )}
          </Box>
        )}
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

export default ImportExcelPage;
