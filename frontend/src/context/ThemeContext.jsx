import React, { createContext, useContext, useState } from 'react'
import { createTheme } from '@mui/material/styles'

const ThemeContext = createContext()

const pinkRedTheme = createTheme({
  palette: {
    primary: {
      main: '#e91e63',
      light: '#f48fb1',
      dark: '#c2185b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#ab003c',
      contrastText: '#fff',
    },
    background: {
      default: '#fff5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#2d3748',
    },
    h2: {
      fontWeight: 600,
      color: '#2d3748',
    },
    h3: {
      fontWeight: 600,
      color: '#2d3748',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: '0 4px 14px 0 rgba(233, 30, 99, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(233, 30, 99, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(233, 30, 99, 0.1)',
        },
      },
    },
  },
})

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  const theme = pinkRedTheme

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}