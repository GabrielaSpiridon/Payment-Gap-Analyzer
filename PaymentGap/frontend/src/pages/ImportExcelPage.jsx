import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
   Alert as MuiAlert,
  Snackbar,
  Stack,
  Chip,
} from '@mui/material';
import { UploadFile, CheckCircle, Error as ErrorIcon, Replay } from '@mui/icons-material';
import axios from 'axios';

function ImportExcelPage() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setResults([]);
  };

  const handleUpload = async () => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    setUploading(true);
    try {
      const res = await axios.post(
        'http://localhost:8000/api/upload-excel/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const responseResults = res.data.results || [];
      setResults(responseResults);
      const allSuccess = responseResults.every((r) => r.status === 'success');
      setSnackbar({
        open: true,
        message: allSuccess
          ? 'All files uploaded successfully!'
          : 'Some files failed to import.',
        severity: allSuccess ? 'success' : 'warning',
      });
    } catch (err) {
      const fallback = files.map((f) => ({ fileName: f.name, status: 'failed', message: 'Network or server error' }));
      const responseResults = err.response?.data?.results || fallback;
      setResults(responseResults);
      setSnackbar({ open: true, message: 'Upload failed.', severity: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const retryFailed = () => {
    const failed = results
      .filter((r) => r.status !== 'success')
      .map((r) => files.find((f) => f.name === r.fileName));
    setFiles(failed);
    setResults([]);
    fileInputRef.current.value = null;
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper elevation={4} sx={{ p: 3, maxWidth: 700, mx: 'auto', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Importați fișiere Excel
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFile />}
          >
            Alege fișiere
            <input
              hidden
              multiple
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </Button>

          {files.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {files.map((file) => (
                <Chip key={file.name} label={file.name} />
              ))}
            </Stack>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={handleUpload}
            disabled={uploading || !files.length}
          >
            {uploading ? <CircularProgress size={24} /> : 'Încarcă fișiere'}
          </Button>

          {results.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Rezultate import
              </Typography>
              <List disablePadding>
                {results.map((r, idx) => (
                  <ListItem
                    key={idx}
                    sx={{ bgcolor: r.status === 'success' ? 'success.lighter' : 'error.lighter', mb: 1, borderRadius: 1 }}
                  >
                    <ListItemIcon>
                      {r.status === 'success' ? (
                        <CheckCircle color="success" />
                      ) : (
                        <ErrorIcon color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={r.fileName}
                      secondary={
                        r.status === 'success' ? 'Import reușit' : `Eroare: ${r.message}`
                      }
                    />
                  </ListItem>
                ))}
                {results.some((r) => r.status !== 'success') && (
                  <Box textAlign="right" mt={1}>
                    <Button
                      variant="text"
                      startIcon={<Replay />}
                      onClick={retryFailed}
                    >
                      Reîncearcă fișiere eșuate
                    </Button>
                  </Box>
                )}
              </List>
            </Box>
          )}
        </Stack>
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
