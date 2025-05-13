// src/App.tsx
import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAuthStore } from './store/authStore';
import AppRoutes from './Routes';
import theme from './theme';
import { initializeLocation } from './utils/LocationUtils';
import CompleteAuthSecurityWrapper from './components/security/AuthSecurityWrapper';

/**
 * Main App component that wraps the entire application
 * Handles authentication state initialization and route protection
 */
const App: React.FC = () => {
  const { hydrated } = useAuthStore();
  
  // Initialize location
  useEffect(() => {
    initializeLocation();
  }, []);

  // Handle AdSense initialization if needed
  useEffect(() => {
    // Only load AdSense if we're in production
    if (process.env.NODE_ENV === 'production') {
      try {
        // Initialize AdSense ads when they become viewable
        if (window.adsbygoogle && window.adsbygoogle.push) {
          window.adsbygoogle.push({
            google_ad_client: process.env.REACT_APP_ADSENSE_PUBLISHER_ID,
            enable_page_level_ads: true
          });
        }
      } catch (error) {
        console.error('Error initializing AdSense:', error);
      }
    }
  }, []);

  // Wait for authentication state to be hydrated before rendering routes
  if (!hydrated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CompleteAuthSecurityWrapper>
        <AppRoutes />
      </CompleteAuthSecurityWrapper>
    </ThemeProvider>
  );
};

// Add window type augmentation for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default App;