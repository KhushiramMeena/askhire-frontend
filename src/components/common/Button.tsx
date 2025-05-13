
import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface ButtonPropsWithStyle extends ButtonProps {
  label: string;
}

const Button: React.FC<ButtonPropsWithStyle> = ({ label, ...props }) => {
  return (
    <MuiButton variant="contained" color="primary" {...props}>
      {label}
    </MuiButton>
  );
};

export default Button;
