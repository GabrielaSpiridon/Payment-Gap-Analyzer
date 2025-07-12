import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function SalaryGenderSeniorityBarChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/salary-gender-seniority/")
      .then(res => res.json())
      .then(rows => {
        const seniority = rows.map(r => r.seniority);
        const male = rows.map(r => r.Male);
        const female = rows.map(r => r.Female);
        const total = rows.map(r => r.Total);

        setData({
          labels: seniority,
          datasets: [
            {
              label: "Male",
              data: male,
              backgroundColor: "rgba(54,162,235,0.7)",
            },
            {
              label: "Female",
              data: female,
              backgroundColor: "rgba(255,99,132,0.7)",
            },
            {
              label: "Total",
              data: total,
              backgroundColor: "rgba(75,192,192,0.5)",
            },
          ]
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!data) return <Typography color="error">No data for this chart.</Typography>;

   const options = {
    responsive: true,
    maintainAspectRatio: false,   // allow parent to control dimensions
    plugins: { legend: { position: 'bottom' } },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Average Salary" }
      },
      x: {
        title: { display: true, text: "Seniority Level" }
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Average Salary by Gender and Seniority
      </Typography>
       <Box sx={{ width: '100%', height: { xs: 300, md: 500 } }}>
      <Bar data={data} options={options} />
    </Box>
    </Box>
  );
}

export default SalaryGenderSeniorityBarChart;
