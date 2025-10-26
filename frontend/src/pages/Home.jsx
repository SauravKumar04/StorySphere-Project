import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from '@mui/material'
import {
  Search,
  Favorite,
  BookmarkBorder,
  Visibility,
} from '@mui/icons-material'
import { storyApi } from '../api/storyApi.js'
import { useTheme } from '../context/ThemeContext'

const Home = () => {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { theme } = useTheme()

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      const storiesData = await storyApi.getAllStories()
      setStories(storiesData)
    } catch (error) {
      console.error('Failed to load stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading stories...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
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
          Discover Amazing Stories
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Dive into a world of captivating tales and creative writing
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search stories by title, genre, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              backgroundColor: 'white',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Stories Grid */}
      <Grid container spacing={3}>
        {filteredStories.map((story) => (
          <Grid item xs={12} sm={6} md={4} key={story._id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px 0 rgba(233, 30, 99, 0.15)`,
                },
              }}
            >
              {story.coverImage && (
                <CardMedia
                  component="img"
                  height="200"
                  image={story.coverImage}
                  alt={story.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {story.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {story.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={story.genre} 
                    size="small" 
                    sx={{ 
                      backgroundColor: theme.palette.primary.light,
                      color: 'white',
                      fontWeight: 600,
                    }} 
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    By {story.author?.username}
                  </Typography>
                  <Box>
                    <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                      <Favorite />
                    </IconButton>
                    <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                      <BookmarkBorder />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredStories.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No stories found. Be the first to create one!
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default Home