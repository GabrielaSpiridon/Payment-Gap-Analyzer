import React from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Box,
  Button,
  Typography,
  Paper,
  Link,
  Stack,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import PeopleIcon from '@mui/icons-material/People';

// → importă-ți componenta chart (calea poate fi alta în proiectul tău)
import GenderPayGapTrendsChart from '../components/GenderPayGapTrendsChart';

export default function HomePage() {
  const navigate = useNavigate();
  const gpgLink = 'https://commission.europa.eu/.../gender-equality_en';

  const sections = [
    {
      title: 'Chart Dashboard',
      description: 'Interactive charts and insights into salary data.',
      icon: <BarChartIcon fontSize="large" color="primary" />,
      path: '/dashboard',
    },
    {
      title: 'Gender Pay Gap Analysis',
      description: 'View detailed pay gap reports.',
      icon: <PieChartIcon fontSize="large" color="secondary" />,
      path: '/gender-pay-gap',
    },
    {
      title: 'Employee Workforce',
      description: 'Explore workforce demographics.',
      icon: <PeopleIcon fontSize="large" color="success" />,
      path: '/employees',
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Main Banner */}
      <Paper
        elevation={4}
        sx={{ p: 4, borderRadius: 3, mb: 6, bgcolor: 'background.paper' }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <HomeIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant="h3" component="h1" color="text.primary">
            Home Page
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          Welcome to our salary analysis platform. Access key insights, visualize trends,
          and generate reports to understand pay disparities across your organization.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/dashboard')}
          sx={{ textTransform: 'none' }}
        >
          Go to Chart Dashboard
        </Button>
      </Paper>

      {/* Gender Pay Gap Info + Mini-Chart */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 6, bgcolor: 'grey.50' }}>
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          What is the Gender Pay Gap?
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" paragraph>
            The Gender Pay Gap (GPG) shows the percentage difference between women’s
            and men’s average (or median) earnings. The farther the GPG is from zero,
            the greater the inequality in pay.
          </Typography>
          <Typography variant="body1" paragraph>
            This is not the same as equal pay, which guarantees equal pay for equal or
            comparable work. A GPG can persist even if equal-pay laws are enforced,
            reflecting broader factors such as job distribution, seniority, and hours worked.
          </Typography>
        </Box>

        {/* Butonul cu link extern */}
        <Tooltip
          title={
            <Box sx={{ p: 1, maxWidth: 300 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Find out more about the gender pay gap:
              </Typography>
              <Link
                href={gpgLink}
                target="_blank"
                rel="noopener"
                underline="hover"
              >
                commission.europa.eu/…/gender-equality_en
              </Link>
            </Box>
          }
          arrow
          placement="right"
        >
          <Button
            variant="outlined"
            size="medium"
            onClick={() => window.open(gpgLink, '_blank')}
            sx={{ textTransform: 'none' }}
          >
            Find out more about the Gender Pay Gap ►
          </Button>
        </Tooltip>

        {/* Aici includem mini-chart-ul */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" mb={2}>
            Evoluția GPG (pe ultimii ani)
          </Typography>
          <GenderPayGapTrendsChart />
        </Box>

        <Typography variant="body2" display="block" sx={{ mt: 3 }}>
          Target range: –5% to +5% (allows for normal workforce fluctuations)
        </Typography>
      </Paper>

      {/* Navigation Cards */}
      <Grid container spacing={4}>
        {sections.map((sec, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{
                height: '100%',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)' },
              }}
            >
              <Box sx={{ textAlign: 'center' }}>{sec.icon}</Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ mt: 2, mb: 1, textAlign: 'center' }}
              >
                {sec.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', mb: 2 }}
              >
                {sec.description}
              </Typography>
              <Button
                size="medium"
                onClick={() => navigate(sec.path)}
                sx={{ mt: 'auto', textTransform: 'none' }}
              >
                Access
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
