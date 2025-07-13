import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function SalaryTrendByMonth() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/salary-by-month/')
      .then(res => res.json())
      .then(data => {
        const labels = data.map(item => item.month);
        const male = data.map(item => item.Male);
        const female = data.map(item => item.Female);
        const gap = data.map(item => item.Gap);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Male',
              data: male,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.3
            },
            {
              label: 'Female',
              data: female,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.3
            },
            {
              label: 'Gap',
              data: gap,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderDash: [5, 5],
              tension: 0.3
            }
          ]
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!chartData) return <Typography color="error">No data for this chart.</Typography>;

   const options = {
    responsive: true,
    maintainAspectRatio: false,    // allow wrapper to size it
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { beginAtZero: true, title: { display: true, text: 'Average Salary' } }
    }
  };

  return (
   <Box sx={{ width: '100%', height: { xs: 300, md: 500 }}}>
      <Typography variant="h6" mb={2}>
         New Hires Monthly Salaries Trend by Gender
      </Typography>
      <Line data={chartData} options={options} />
    </Box>
  );
}

export default SalaryTrendByMonth;
