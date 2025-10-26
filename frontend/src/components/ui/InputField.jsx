import React from 'react'
import { TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const InputField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  helperText,
  required = false,
  ...props 
}) => {
  const theme = useTheme()

  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      required={required}
      variant="outlined"
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
          },
        },
        ...props.sx,
      }}
    />
  )
}

export default InputField