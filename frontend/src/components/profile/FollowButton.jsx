import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { PersonAdd, PersonRemove } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { userApi } from '../../api/userApi.js'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const FollowButton = ({ userId }) => {
  const theme = useTheme()
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if current user is following this user
    if (user && user.following) {
      setIsFollowing(user.following.includes(userId))
    }
  }, [user, userId])

  const handleFollow = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      await userApi.toggleFollow(userId)
      setIsFollowing(!isFollowing)
      toast.success(isFollowing ? 'Unfollowed user' : 'Started following user')
    } catch (error) {
      toast.error('Failed to update follow status')
    } finally {
      setLoading(false)
    }
  }

  if (!user || user._id === userId) return null

  return (
    <Button
      variant={isFollowing ? "outlined" : "contained"}
      startIcon={isFollowing ? <PersonRemove /> : <PersonAdd />}
      onClick={handleFollow}
      disabled={loading}
      sx={{
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: 600,
        ...(isFollowing && {
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
        }),
      }}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  )
}

export default FollowButton