// src/components/common/Spinner.tsx
import React from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
  thickness?: number;
  sx?: React.CSSProperties;
}

/**
 * Spinner component for loading states using MUI CircularProgress
 */
const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'medium', 
  color = 'primary',
  thickness = 3.6,
  sx
}) => {
  const theme = useTheme();
  
  // Size mapping
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        ...sx
      }}
    >
      <CircularProgress 
        size={sizeMap[size]} 
        color={color}
        thickness={thickness}
      />
    </Box>
  );
};

export default Spinner;