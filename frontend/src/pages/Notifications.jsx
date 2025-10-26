import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Favorite,
  Comment,
  PersonAdd,
  ClearAll,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { notificationApi } from '../api/notificationApi'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/ui/Loader'

const Notifications = () => {
  const theme = useTheme()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const notificationsData = await notificationApi.getNotifications()
      setNotifications(notificationsData)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Favorite sx={{ color: theme.palette.primary.main }} />
      case 'comment':
        return <Comment sx={{ color: theme.palette.primary.main }} />
      case 'follow':
        return <PersonAdd sx={{ color: theme.palette.primary.main }} />
      default:
        return <PersonAdd sx={{ color: theme.palette.primary.main }} />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'like':
        return theme.palette.primary.light
      case 'comment':
        return theme.palette.secondary.light
      case 'follow':
        return theme.palette.success.light
      default:
        return theme.palette.primary.light
    }
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Please log in to view notifications.</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 700,
          }}
        >
          Notifications
        </Typography>

        <IconButton>
          <ClearAll />
        </IconButton>
      </Box>

      {loading ? (
        <Loader message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No notifications yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your notifications will appear here
          </Typography>
        </Box>
      ) : (
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification._id}
              sx={{
                backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                borderRadius: '12px',
                mb: 1,
                border: `1px solid ${theme.palette.divider}`,
              }}
              secondaryAction={
                !notification.isRead && (
                  <Chip
                    label="New"
                    size="small"
                    sx={{
                      backgroundColor: getNotificationColor(notification.type),
                      color: 'white',
                    }}
                    onClick={() => handleMarkAsRead(notification._id)}
                  />
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={notification.fromUser?.avatarUrl}>
                  {notification.fromUser?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getNotificationIcon(notification.type)}
                    <Typography variant="body1">
                      {notification.message}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  )
}

export default Notifications