import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function SalaryGenderJobTitleBarChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/salary-by-gender-job-title/')
      .then(res => res.json())
      .then(data => {
        const labels = Object.keys(data);
        const male = labels.map(job => data[job].Male || 0);
        const female = labels.map(job => data[job].Female || 0);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Male',
              data: male,
              backgroundColor: 'rgba(54, 162, 235, 0.7)'
            },
            {
              label: 'Female',
              data: female,
              backgroundColor: 'rgba(255, 99, 132, 0.7)'
            }
          ]
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!chartData) return <Typography color="error">No data available for this chart.</Typography>;
  const options = {
    responsive: true,
    maintainAspectRatio: false,    // ← allow CSS to size it
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Average Salary' } },
      x: { title: { display: true, text: 'Job Title' } }
    }
  };

  return (
     <Box>
      <Typography variant="h6" mb={2}>
        Average Salary by Gender per Job Title
      </Typography>
      {/* give the chart a responsive height */}
      <Box sx={{ width: '100%', height: { xs: 300, md: 500 } }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
}

export default SalaryGenderJobTitleBarChart;
