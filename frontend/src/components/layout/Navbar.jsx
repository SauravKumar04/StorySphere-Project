import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Create,
  Person,
  BookmarkBorder,
  Logout,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { theme } = useTheme()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    navigate('/')
  }

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'white',
        color: theme.palette.text.primary,
        boxShadow: '0 2px 20px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: `1px solid rgba(233, 30, 99, 0.1)`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 700,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            StorySphere
          </Typography>

          {/* Mobile Menu */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{
                fontWeight: 600,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Discover
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/library"
              sx={{
                fontWeight: 600,
                '&:hover': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              My Library
            </Button>
          </Box>

          {/* Auth Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<Create />}
                  component={Link}
                  to="/create-story"
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Write Story
                </Button>
                
                <IconButton onClick={handleMenu}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                    <Person sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { handleClose(); navigate('/library'); }}>
                    <BookmarkBorder sx={{ mr: 1 }} />
                    My Library
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  sx={{
                    fontWeight: 600,
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/register"
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar