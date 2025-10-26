import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
} from '@mui/material'
import {
  ArrowBack,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useStory } from '../context/StoryContext'
import CreateStory from './CreateStory'
import Loader from '../components/ui/Loader'

const EditStory = () => {
  const theme = useTheme()
  const { id } = useParams()
  const navigate = useNavigate()
  const { loadStory, currentStory, updateStory } = useStory()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStoryData()
  }, [id])

  const loadStoryData = async () => {
    try {
      await loadStory(id)
    } catch (error) {
      setError('Failed to load story')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStory = async (storyData) => {
    try {
      await updateStory(id, storyData)
      navigate(`/story/${id}`)
    } catch (error) {
      throw error
    }
  }

  if (loading) return <Loader message="Loading story..." />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!currentStory) return <Typography>Story not found</Typography>

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/story/${id}`)}
          sx={{ mb: 2 }}
        >
          Back to Story
        </Button>
        
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
          Edit Story
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        {/* We can reuse the CreateStory component with edit mode */}
        <CreateStory 
          editMode 
          initialData={currentStory} 
          onSubmit={handleUpdateStory}
        />
      </Paper>
    </Container>
  )
}

export default EditStory