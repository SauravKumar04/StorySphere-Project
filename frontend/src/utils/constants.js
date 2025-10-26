import { createTheme } from '@mui/material/styles'

export const pinkRedTheme = createTheme({
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
    h4: {
      fontWeight: 600,
      color: '#2d3748',
    },
    h5: {
      fontWeight: 600,
      color: '#2d3748',
    },
    h6: {
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
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
  },
})

export const GENRES = [
  'Fantasy',
  'Science Fiction',
  'Romance',
  'Mystery',
  'Thriller',
  'Horror',
  'Historical',
  'Contemporary',
  'Young Adult',
  'Children',
  'Poetry',
  'Drama',
  'Comedy',
  'Adventure',
  'Other',
]

export const STORY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
}

export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  CHAPTER: 'chapter',
}