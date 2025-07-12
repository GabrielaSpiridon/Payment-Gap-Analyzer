import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AgeBarChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/age-distribution/')
      .then(res => res.json())
      .then(data => {
        const labels = data.map(item => item.age_group);
        const values = data.map(item => item.count);
        const colors = [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 244, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(156, 102, 255, 0.77)',
          'rgba(201, 203, 207, 0.7)'
        ];

        setChartData({
          labels,
          datasets: [{
            label: 'Employees Count',
            data: values,
            backgroundColor: colors.slice(0, labels.length)
          }]
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!chartData) return <Typography color="error">No data available for this chart.</Typography>;

   const options = {
    responsive: true,
    maintainAspectRatio: false, // allow parent container to control size
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { title: { display: true, text: 'Age Group' } },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Employees' }
      }
    }
  };

  return (
     <Box sx={{ width: '100%', height: { xs: 300, md: 500 } }}>
      <Typography variant="h6" mb={2}>
        Employees Age Distribution
      </Typography>
      <Bar data={chartData} options={options} />
    </Box>
  );
}

export default AgeBarChart;
