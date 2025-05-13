// src/components/common/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper, 
  Box 
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  sx?: React.CSSProperties;
}

/**
 * SearchBar component for searching functionality
 * Uses MUI TextField for consistent design
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  initialValue = '',
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  sx
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  
  // Update search query if initialValue changes
  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}
    >
      <TextField
        variant={variant}
        size={size}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        fullWidth={fullWidth}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />
    </Box>
  );
};

export default SearchBar;