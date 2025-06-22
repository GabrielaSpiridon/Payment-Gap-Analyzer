import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'; 

Chart.register(ArcElement, Tooltip, Legend); 

function GenderPieChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/gender-distribution/')
      .then(res => res.json())
      .then(data => {
        const labels = data.map(item => item.gender);
        const values = data.map(item => item.count);
        setChartData({
          labels,
          datasets: [{
            data: values,
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 99, 132, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)'
            ]
          }]
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!chartData) return <Typography color="error">No data available for this chart.</Typography>;

  return (
    <Box>
      <Typography variant="h6" mb={2}>Employees gender distribution</Typography>
      <Pie data={chartData} options={{
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }} />
    </Box>
  );
}

export default GenderPieChart;
