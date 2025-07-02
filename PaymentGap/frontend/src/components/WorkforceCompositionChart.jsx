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

function WorkforceCompositionChart() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/workforce-composition/')
            .then(res => res.json())
            .then(rows => {
                const labels = rows.map(r => r.category);
                const female = rows.map(r => r.Female);
                const male = rows.map(r => r.Male);
                const femaleCounts = rows.map(r => r.Female_count);
                const maleCounts = rows.map(r => r.Male_count);

                setData({
                    labels,
                    datasets: [
                        {
                            label: 'Women',
                            data: female,
                            backgroundColor: 'rgba(255, 165, 0, 0.8)',
                            countData: femaleCounts
                        },
                        {
                            label: 'Men',
                            data: male,
                            backgroundColor: 'rgba(54, 162, 235, 0.8)',
                            countData: maleCounts
                        }
                    ]
                });

                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <CircularProgress />;
    if (!data) return <Typography color="error">No data available for this chart.</Typography>;

    return (
        <Box>
            <Typography variant="h6" mb={2}>Workforce Composition by Role and Gender</Typography>
            <Bar
                data={data}
                options={{
                    indexAxis: 'y',
                    responsive: true,
                    scales: {
                        x: {
                            stacked: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Percentage'
                            }
                        },
                        y: {
                            stacked: true
                        }
                    },
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            callbacks: {
                                label: ctx => {
                                    const label = ctx.dataset.label;
                                    const percent = ctx.parsed.x;
                                    const count = ctx.dataset.countData[ctx.dataIndex];
                                    return `${label}: ${percent}% (${count} people)`;
                                }
                            }
                        }
                    }
                }}
            />
        </Box>
    );
}

export default WorkforceCompositionChart;
