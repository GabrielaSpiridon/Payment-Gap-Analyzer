import React, { useEffect, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist-min';     // ← aici e build-ul complet
import { Box, CircularProgress, Typography } from '@mui/material';

const Plot = createPlotlyComponent(Plotly);

export default function HeatmapSalary() {
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/salary-heatmap/')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => setHeatmap(json))
      .catch(err => {
        console.error('Fetch heatmap failed:', err);
        setHeatmap(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!heatmap) {
    return <Typography color="error" mt={2}>Nu există date pentru heatmap.</Typography>;
  }

  const { rows, cols, values } = heatmap;

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Heatmap Payment Gap
      </Typography>
      <Plot
        data={[
          {
            z: values,
            x: cols,
            y: rows,
            type: 'heatmap',      // acum recunoscut de Plotly
            colorscale: 'RdBu',
            reversescale: true,
            showscale: true,
          }
        ]}
        layout={{
          autosize: true,
          xaxis: { title: 'Department' },
          yaxis: { title: 'Category' },
          margin: { t: 40, l: 80, b: 50, r: 30 },
        }}
        style={{ width: '100%', height: '500px' }}
      />
    </Box>
  );
}