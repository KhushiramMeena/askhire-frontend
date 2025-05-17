// src/pages/ErrorPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  SvgIcon
} from '@mui/material';

const ErrorPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Askhire</title>
        <meta name="description" content="The page you were looking for could not be found." />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <SvgIcon
            sx={{ 
              fontSize: 64, 
              color: 'error.main', 
              mx: 'auto', 
              mb: 4,
              display: 'block'
            }}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
            />
          </SvgIcon>
          
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Page Not Found
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 400, mx: 'auto' }}>
            The page you were looking for doesn't exist or has been moved.
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
          >
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4 }}
            >
              Go Home
            </Button>
            
            <Button
              component={Link}
              to="/jobs"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ px: 4 }}
            >
              Browse Jobs
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default ErrorPage;