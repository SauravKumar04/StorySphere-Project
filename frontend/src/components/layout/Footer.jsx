import React from 'react'
import { Box, Container, Typography, IconButton } from '@mui/material'
import { Facebook, Twitter, Instagram } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

const Footer = () => {
  const theme = useTheme()

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 700,
              mb: { xs: 2, md: 0 },
            }}
          >
            StorySphere
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, md: 0 } }}>
            © 2024 StorySphere. All rights reserved.
          </Typography>
          
          <Box>
            <IconButton aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton aria-label="Twitter">
              <Twitter />
            </IconButton>
            <IconButton aria-label="Instagram">
              <Instagram />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer