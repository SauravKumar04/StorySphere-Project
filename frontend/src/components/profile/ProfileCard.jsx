import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
} from '@mui/material'
import {
  Person,
  BookmarkBorder,
  Favorite,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import FollowButton from './FollowButton'

const ProfileCard = ({ user, isCurrentUser = false }) => {
  const theme = useTheme()

  return (
    <Card sx={{ position: 'relative' }}>
      <Box
        sx={{
          height: 120,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          borderRadius: '12px 12px 0 0',
        }}
      />
      
      <CardContent sx={{ pt: 0, textAlign: 'center' }}>
        <Avatar
          src={user.avatarUrl}
          sx={{
            width: 100,
            height: 100,
            mx: 'auto',
            mt: -6,
            border: `4px solid ${theme.palette.background.paper}`,
            backgroundColor: theme.palette.primary.light,
          }}
        >
          {user.username?.charAt(0).toUpperCase()}
        </Avatar>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
          {user.username}
        </Typography>

        {user.bio && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {user.bio}
          </Typography>
        )}

        {!isCurrentUser && <FollowButton userId={user._id} />}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Box textAlign="center">
            <Typography variant="h6" color="primary">
              {user.followers?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Followers
            </Typography>
          </Box>
          
          <Box textAlign="center">
            <Typography variant="h6" color="primary">
              {user.following?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Following
            </Typography>
          </Box>
          
          <Box textAlign="center">
            <Typography variant="h6" color="primary">
              {user.storiesCount || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stories
            </Typography>
          </Box>
        </Box>

        {user.interests && user.interests.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Interests
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
              {user.interests.slice(0, 5).map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: theme.palette.primary.light,
                    color: theme.palette.primary.main,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ProfileCard