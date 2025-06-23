import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function SalaryYearLineChart() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/salary-by-year/")
      .then(res => res.json())
      .then(rows => {
        // Extrage toți anii, chiar dacă lipsesc date pentru un gender
        const years = rows.map(r => r.year);
        const male = rows.map(r => r.Male ?? null);
        const female = rows.map(r => r.Female ?? null);
        const total = rows.map(r => r.Total ?? null);

        setData({
          labels: years,
          datasets: [
            {
              label: "Male",
              data: male,
              borderColor: "rgba(54,162,235,1)",
              backgroundColor: "rgba(54,162,235,0.1)",
              fill: false,
              tension: 0.3,
              pointStyle: "circle",
              pointRadius: 4,
            },
            {
              label: "Female",
              data: female,
              borderColor: "rgba(255,99,132,1)",
              backgroundColor: "rgba(255,99,132,0.1)",
              fill: false,
              tension: 0.3,
              pointStyle: "rectRot",
              pointRadius: 4,
            },
            {
              label: "Total",
              data: total,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.1)",
              borderDash: [6, 4],
              fill: false,
              tension: 0.3,
              pointStyle: "star",
              pointRadius: 4,
            }
          ]
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!data) return <Typography color="error">No data for this chart.</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" mb={2}>Average Salary by Year and Gender</Typography>
      <Line data={data} options={{
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Average Salary" } }
        }
      }} />
    </Box>
  );
}

export default SalaryYearLineChart;
