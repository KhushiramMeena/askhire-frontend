import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  variant?: 'outlined' | 'filled' | 'standard'; // Optional, defaults to 'outlined'
}

const Input: React.FC<InputProps> = ({ label, variant = 'outlined', ...props }) => {
  return (
    <TextField
      variant={variant}
      label={label}
      fullWidth
      {...props}
    />
  );
};

export default Input;