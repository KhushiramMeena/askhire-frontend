// src/App.tsx
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuthStore } from './store/authStore';
import AppRoutes from './Routes';
import theme from './theme';
import { initializeLocation } from './utils/LocationUtils';
import CompleteAuthSecurityWrapper from './components/security/AuthSecurityWrapper';

const App: React.FC = () => {
  const { hydrated } = useAuthStore();

  // Initialize location
  useEffect(() => {
    initializeLocation();
  }, []);

  // Remove the loading spinner, index.html loader will handle this
  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AskHire",
              "url": "https://askhire.in",
              "sameAs": [
                "https://www.crunchbase.com/organization/askhire"
              ]
            }
          `}
        </script>
      </Helmet>

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