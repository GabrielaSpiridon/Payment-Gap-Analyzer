import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function SalaryGenderDepartmentBarChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/salary-gender-department/')
      .then(res => res.json())
      .then(data => {
        // Pregătește datele pentru chart.js
        const departments = Object.keys(data);
        const genders = Array.from(new Set(departments.flatMap(dept => Object.keys(data[dept]))));

        const datasets = genders.map((gender, i) => ({
          label: gender,
          data: departments.map(dept => data[dept][gender] || 0),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)', // Male
            'rgba(255, 99, 132, 0.7)', // Female
            'rgba(255, 206, 86, 0.7)', // Other
          ][i % 3]
        }));

        setChartData({
          labels: departments,
          datasets,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!chartData) return <Typography color="error">No data for this chart.</Typography>;

  const options = {
      responsive: true,
      maintainAspectRatio: false,   // allow the wrapper to dictate size
      plugins: {
        legend: { position: 'top' },
        tooltip: { enabled: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Average Salary' }
        },
        x: {
          title: { display: true, text: 'Department' }
        }
      }
    };


  return (
     <Box>
      <Typography variant="h6" mb={2}>
        Average Salary by Gender per Department
      </Typography>
      {/* Responsive wrapper: full width, height 300px on mobile, 500px on desktop */}
      <Box sx={{ width: '100%', height: { xs: 300, md: 500 } }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
}

export default SalaryGenderDepartmentBarChart;
