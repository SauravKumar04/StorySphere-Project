import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material'
import {
  BookmarkBorder,
  Favorite,
  History,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { bookmarkApi } from '../api/bookmarkApi.js'
import { useAuth } from '../context/AuthContext'
import StoryList from '../components/stories/StoryList'
import Loader from '../components/ui/Loader'

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`library-tabpanel-${index}`}
      aria-labelledby={`library-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const Library = () => {
  const theme = useTheme()
  const { user } = useAuth()
  const [tabValue, setTabValue] = useState(0)
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookmarks()
  }, [])

  const loadBookmarks = async () => {
    setLoading(true)
    try {
      const bookmarksData = await bookmarkApi.getBookmarks()
      setBookmarks(bookmarksData)
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Please log in to view your library.</Typography>
      </Container>
    )
  }

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
        My Library
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 120,
            },
          }}
        >
          <Tab icon={<BookmarkBorder />} iconPosition="start" label="Bookmarks" />
          <Tab icon={<Favorite />} iconPosition="start" label="Liked Stories" />
          <Tab icon={<History />} iconPosition="start" label="Reading History" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Loader message="Loading bookmarks..." />
          ) : (
            <StoryList 
              stories={bookmarks.map(bookmark => bookmark.storyId)} 
              loading={false}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              Your liked stories will appear here.
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              Your reading history will appear here.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default Library