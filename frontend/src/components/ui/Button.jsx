import React from 'react'
import { Button as MuiButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const Button = ({ children, variant = 'contained', ...props }) => {
  const theme = useTheme()

  return (
    <MuiButton
      variant={variant}
      {...props}
      sx={{
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        ...props.sx,
        ...(variant === 'contained' && {
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          boxShadow: '0 4px 14px 0 rgba(233, 30, 99, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(233, 30, 99, 0.4)',
          },
        }),
      }}
    >
      {children}
    </MuiButton>
  )
}

export default Button