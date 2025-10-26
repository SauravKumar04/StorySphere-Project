import React from 'react'
import { Grid, Box, Typography } from '@mui/material'
import StoryCard from './StoryCard'

const StoryList = ({ stories, loading }) => {
  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Typography>Loading stories...</Typography>
      </Box>
    )
  }

  if (!stories || stories.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          No stories found. Be the first to create one!
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {stories.map((story) => (
        <Grid item xs={12} sm={6} md={4} key={story._id}>
          <StoryCard story={story} />
        </Grid>
      ))}
    </Grid>
  )
}

export default StoryList