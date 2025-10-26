import React from 'react'
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material'
import {
  People,
  Book,
  Comment,
  TrendingUp,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme()

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

const AdminDashboard = () => {
  const theme = useTheme()

  // Mock data - in real app, this would come from API
  const stats = [
    { title: 'Total Users', value: '1,234', icon: <People />, color: theme.palette.primary.light },
    { title: 'Total Stories', value: '567', icon: <Book />, color: theme.palette.secondary.light },
    { title: 'Total Comments', value: '8,901', icon: <Comment />, color: theme.palette.success.light },
    { title: 'Active Users', value: '123', icon: <TrendingUp />, color: theme.palette.warning.light },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 700,
        }}
      >
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography color="text.secondary">
              Admin features and analytics will be displayed here.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography color="text.secondary">
              Management tools and quick actions will appear here.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AdminDashboard