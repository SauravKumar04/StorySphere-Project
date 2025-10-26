import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
} from '@mui/material'
import {
  Home,
  Explore,
  BookmarkBorder,
  Notifications,
  Person,
  Create,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useAuth } from '../../context/AuthContext'

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Discover', icon: <Explore />, path: '/discover' },
    { text: 'My Library', icon: <BookmarkBorder />, path: '/library' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
    { text: 'Write Story', icon: <Create />, path: '/create-story' },
  ]

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 700,
            mb: 2,
          }}
        >
          StorySphere
        </Typography>
        
        {user && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Welcome, {user.username}!
          </Typography>
        )}
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: '8px',
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light + '20',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light + '30',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 
                    theme.palette.primary.main : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar