import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    if (!userId) {
      console.log('No userId provided. Redirecting to login.');
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Te rog selecteaza un fisier.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/uploadExcel/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadStatus('Upload reusit! ' + response.data.message);
    } catch (error) {
      console.error('Eroare la upload:', error);
      setUploadStatus('Eroare la incarcare fisier.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      <p>Bine ai venit, utilizator ID: {userId}</p>

      <div className="mt-4">
        <h4>Import Excel angajați</h4>
        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="form-control" />
        <button className="btn btn-primary mt-2" onClick={handleUpload}>Încarcă fișier</button>
        {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
      </div>

      <hr />
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
