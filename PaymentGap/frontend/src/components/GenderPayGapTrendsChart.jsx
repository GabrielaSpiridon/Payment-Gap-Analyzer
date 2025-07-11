import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function GenderPayGapTrendsChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/gender-pay-gap-trends/')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(json => {
        console.log('API response:', json);
        // Dacă răspunsul nu e direct un array, scoatem array-ul de jos
        const rows = Array.isArray(json)
          ? json
          : json.results
          ? json.results
          : json.data
          ? json.data
          : [];

        // extragem anul și cele patru valori
        const labels    = rows.map(item => item.year);
        const avgTotal  = rows.map(item => item.avg_total_remuneration_gpg);
        const avgBase   = rows.map(item => item.avg_base_salary_gpg);
        const medTotal  = rows.map(item => item.median_total_remuneration_gpg);
        const medBase   = rows.map(item => item.median_base_salary_gpg);
        // banda țintă 5%
        const targetBand = labels.map(() => 5);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Target range ±5%',
              data: targetBand,
              fill: { target: 0 },
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderWidth: 0,
              pointRadius: 0,
            },
            {
              label: 'Average total remuneration GPG',
              data: avgTotal,
              borderWidth: 2,
              tension: 0.4,
              borderColor: 'rgba(242, 140, 40, 0.8)',
              backgroundColor: 'rgba(242, 140, 40, 0.2)',
              pointRadius: 3,
            },
            {
              label: 'Median total remuneration GPG',
              data: medTotal,
              borderWidth: 2,
              tension: 0.4,
              borderColor: 'rgba(242, 198, 73, 0.8)',
              backgroundColor: 'rgba(242, 198, 73, 0.2)',
              pointRadius: 3,
            }
          ]
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error || !chartData) {
    return <Typography color="error">Date indisponibile pentru grafic.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Progres Gender Pay Gap
      </Typography>
      <Line
        data={chartData}
        options={{
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          stacked: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: ctx => {
                  if (ctx.dataset.label.includes('Target')) return null;
                  return `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`;
                }
              }
            }
          },
          scales: {
            y: {
              title: { display: true, text: 'Gender pay gap (%)' },
              min: 0,
              max: 30
            },
            x: {
              title: { display: true, text: 'Anul raportat' }
            }
          }
        }}
      />
    </Box>
  );
}
