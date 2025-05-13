// src/components/common/CustomPagination.tsx
import React from 'react';
import { Pagination, PaginationItem, Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  color?: 'primary' | 'secondary' | 'standard';
  size?: 'small' | 'medium' | 'large';
  showFirstButton?: boolean;
  showLastButton?: boolean;
  variant?: 'text' | 'outlined';
  shape?: 'circular' | 'rounded';
  siblingCount?: number;
  boundaryCount?: number;
}

/**
 * CustomPagination component using MUI Pagination
 * For navigating through paginated content
 */
const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  color = 'primary',
  size = 'medium',
  showFirstButton = true,
  showLastButton = true,
  variant = 'outlined',
  shape = 'rounded',
  siblingCount = 1,
  boundaryCount = 1
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }
  
  const handleChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <Pagination
        page={currentPage}
        count={totalPages}
        onChange={handleChange}
        color={color}
        size={size}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        variant={variant}
        shape={shape}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={`?page=${item.page}`}
            {...item}
          />
        )}
      />
    </Box>
  );
};

export default CustomPagination;