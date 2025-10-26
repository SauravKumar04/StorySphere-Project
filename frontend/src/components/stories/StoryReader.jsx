import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Divider,
  Button,
} from '@mui/material'
import {
  Favorite,
  BookmarkBorder,
  Share,
  MenuBook,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useStory } from '../../context/StoryContext'
import { useAuth } from '../../context/AuthContext'

const StoryReader = ({ story }) => {
  const theme = useTheme()
  const { toggleLike } = useStory()
  const { isAuthenticated } = useAuth()
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState(0)

  useEffect(() => {
    // TODO: Load chapters for the story via API
    // Example:
    // fetch(`/api/chapters/${story._id}`)
    //   .then(res => res.json())
    //   .then(data => setChapters(data))
  }, [story])

  const handleLike = async () => {
    if (!isAuthenticated) return
    try {
      await toggleLike(story._id)
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      {/* Story Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          {story.title}
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          By {story.author?.username}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
          <Chip 
            label={story.genre || 'General'} 
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            }} 
          />
          {story.tags?.map((tag, index) => (
            <Chip key={index} label={tag} variant="outlined" />
          ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          <IconButton 
            onClick={handleLike}
            sx={{ 
              color: story.likes?.length > 0 ? theme.palette.primary.main : 'inherit',
            }}
          >
            <Favorite />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {story.likes?.length || 0}
            </Typography>
          </IconButton>
          
          <IconButton>
            <BookmarkBorder />
          </IconButton>
          
          <IconButton>
            <Share />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Story Description */}
      {story.description && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" paragraph>
            {story.description}
          </Typography>
        </Box>
      )}

      {/* Chapters Navigation */}
      {chapters.length > 0 && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Chapters
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {chapters.map((chapter, index) => (
              <Button
                key={chapter._id}
                variant={currentChapter === index ? "contained" : "outlined"}
                startIcon={<MenuBook />}
                onClick={() => setCurrentChapter(index)}
                sx={{ borderRadius: '20px' }}
              >
                {chapter.title}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* Chapter Content */}
      {chapters.length > 0 ? (
        <Box>
          <Typography variant="h4" gutterBottom>
            {chapters[currentChapter]?.title}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {chapters[currentChapter]?.content}
          </Typography>
        </Box>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No chapters available yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for updates!
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default StoryReader
