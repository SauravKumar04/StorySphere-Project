import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  CardActionArea,
} from '@mui/material'
import {
  Favorite,
  BookmarkBorder,
  Visibility,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useStory } from '../../context/StoryContext'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/formatDate'

const StoryCard = ({ story }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { toggleLike } = useStory()
  const { isAuthenticated } = useAuth()

  const handleStoryClick = () => {
    navigate(`/story/${story._id}`)
  }

  const handleLikeClick = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await toggleLike(story._id)
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const handleBookmarkClick = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
    }
    // TODO: Implement bookmark functionality
  }

  return (
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
      <CardActionArea onClick={handleStoryClick} sx={{ flexGrow: 1 }}>
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
            {story.description || 'No description available'}
          </Typography>
          
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={story.genre || 'General'} 
              size="small" 
              sx={{ 
                backgroundColor: theme.palette.primary.light,
                color: 'white',
                fontWeight: 600,
              }} 
            />
            {story.tags?.slice(0, 2).map((tag, index) => (
              <Chip 
                key={index}
                label={tag} 
                size="small" 
                variant="outlined"
                sx={{ 
                  borderColor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
                }} 
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                By {story.author?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(story.createdAt)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton 
                size="small" 
                onClick={handleLikeClick}
                sx={{ 
                  color: story.likes?.length > 0 ? theme.palette.primary.main : 'inherit',
                }}
              >
                <Favorite fontSize="small" />
              </IconButton>
              <Typography variant="caption" sx={{ mr: 1 }}>
                {story.likes?.length || 0}
              </Typography>
              
              <IconButton size="small" onClick={handleBookmarkClick}>
                <BookmarkBorder fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default StoryCard