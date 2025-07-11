import React, { useEffect, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist-min';
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
    return <Typography color="error" mt={2}>No data.</Typography>;
  }

  const { rows, cols, values } = heatmap;

  // ———————————————————————————
  // 1) parametrul de spațiu între celule
  const gapSize = 50;           // px între coloane și între rânduri

  // 2) marginile graficului
  const margin = { t: 40, l: 80, b: 50, r: 30 };

  // 3) calculăm lățimea totală, astfel încât:
  //    fiecare coloană (celulă) să fie la fel de groasă ca gapSize
  // chartWidth = total celule + total gap-uri + stânga + dreapta
  const chartWidth =
    cols.length * gapSize +         // lățimea celulelor
    (cols.length - 1) * gapSize +   // spațiile între ele
    margin.l + margin.r;            // marginile laterale

  // 4) înălțimea totală (opțional)
  const chartHeight = 
    rows.length * gapSize +         // înălțimea celulelor pe verticală
    (rows.length - 1) * gapSize +   // spațiile între rânduri
    margin.t + margin.b;            // marginile sus/jos

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Heatmap Payment Gap
      </Typography>
      <Plot
        data={[{
          type: 'heatmap',
          z: values,
          x: cols,
          y: rows,
          colorscale: 'RdBu',
          reversescale: true,
          showscale: true,
          colorbar: { title: 'Sumă (RON)' },

          // spațiu între “pătrățele”
          xgap: 20,
          ygap: 20
        }]}
        layout={{
          width:  chartWidth,
          height: chartHeight,
          margin,
          xaxis:  { title: 'Department', automargin: true },
          yaxis:  { title: 'Category',   automargin: true }
        }}
          config={{
          //staticPlot: true,      // dezactivează complet zoom/pan și modebar
         displayModeBar: false // dacă ai vrea doar să ascunzi bara de unelte
        }}
        // forțăm container-ul să aibă exact acele dimensiuni
        style={{ width: `${chartWidth}px`, height: `${chartHeight}px` }}
      />
    </Box>
  );
}
