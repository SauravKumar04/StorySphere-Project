import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  Chip,
} from '@mui/material'
import {
  Person,
  Book,
  BookmarkBorder,
  Favorite,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { userApi } from '../api/userApi.js'
import { useAuth } from '../context/AuthContext'
import ProfileCard from '../components/profile/ProfileCard'
import StoryCard from '../components/stories/StoryCard'
import Loader from '../components/ui/Loader'

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const Profile = () => {
  const theme = useTheme()
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  const isCurrentUser = !id || id === currentUser?._id

  useEffect(() => {
    loadUserData()
  }, [id])

  const loadUserData = async () => {
    setLoading(true)
    try {
      let userData
      if (id) {
        userData = await userApi.getUserById(id)
      } else {
        userData = currentUser
      }
      setUser(userData)
      // TODO: Load user's stories
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  if (loading) return <Loader message="Loading profile..." />
  if (!user) return <Typography>User not found</Typography>

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Sidebar */}
        <Grid item xs={12} md={4}>
          <ProfileCard user={user} isCurrentUser={isCurrentUser} />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
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
              <Tab icon={<Book />} iconPosition="start" label="Stories" />
              <Tab icon={<BookmarkBorder />} iconPosition="start" label="Bookmarks" />
              <Tab icon={<Favorite />} iconPosition="start" label="Likes" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Published Stories
              </Typography>
              {stories.length > 0 ? (
                <Grid container spacing={2}>
                  {stories.map((story) => (
                    <Grid item xs={12} key={story._id}>
                      <StoryCard story={story} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    {isCurrentUser ? "You haven't published any stories yet." : "This user hasn't published any stories yet."}
                  </Typography>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Bookmarked Stories
              </Typography>
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  Bookmarked stories will appear here.
                </Typography>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Liked Stories
              </Typography>
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  Liked stories will appear here.
                </Typography>
              </Box>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile