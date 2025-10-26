import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Button,
  IconButton,
  Typography,
  Alert,
} from '@mui/material'
import {
  ArrowBack,
  Edit,
  Delete,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useStory } from '../context/StoryContext'
import { useAuth } from '../context/AuthContext'
import StoryReader from '../components/stories/StoryReader'
import Loader from '../components/ui/Loader'
import Modal from '../components/ui/Modal'

const StoryView = () => {
  const theme = useTheme()
  const { id } = useParams()
  const navigate = useNavigate()
  const { loadStory, currentStory, deleteStory, loading } = useStory()
  const { user } = useAuth()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (id) {
      loadStory(id)
    }
  }, [id])

  const isAuthor = user && currentStory && user._id === currentStory.author._id

  const handleDelete = async () => {
    try {
      await deleteStory(id)
      navigate('/')
    } catch (error) {
      console.error('Failed to delete story:', error)
    } finally {
      setDeleteModalOpen(false)
    }
  }

  if (loading) return <Loader message="Loading story..." />
  if (!currentStory) return <Alert severity="error">Story not found</Alert>

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Back Button and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ borderRadius: '12px' }}
        >
          Back to Stories
        </Button>

        {isAuthor && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<Edit />}
              onClick={() => navigate(`/edit-story/${id}`)}
              variant="outlined"
              sx={{ borderRadius: '12px' }}
            >
              Edit
            </Button>
            <Button
              startIcon={<Delete />}
              onClick={() => setDeleteModalOpen(true)}
              variant="outlined"
              color="error"
              sx={{ borderRadius: '12px' }}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      {/* Story Reader */}
      <StoryReader story={currentStory} />

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Story"
        actions={
          <>
            <Button onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </>
        }
      >
        <Typography>
          Are you sure you want to delete "{currentStory.title}"? This action cannot be undone.
        </Typography>
      </Modal>
    </Container>
  )
}

export default StoryView