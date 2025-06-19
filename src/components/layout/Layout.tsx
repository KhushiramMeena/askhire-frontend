// src/components/layout/Layout.tsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';
import { useAuthStore } from '../../store/authStore';

const Layout: React.FC = () => {
  const { hydrated } = useAuthStore();
  
  // Load Google AdSense script
  useEffect(() => {
    // Only load AdSense if we're in production
    if (process.env.NODE_ENV === 'production') {
      const script = document.createElement('script');
      // script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      
      return () => {
        // Clean up on unmount
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <>
      <Helmet>
  <meta charSet="utf-8" />
  <meta 
    name="viewport" 
    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" 
  />
  <meta name="theme-color" content="#1976d2" />
  <title>Askhire - Find Your Dream Job</title>
  <meta name="description" content="Find your dream job or post job opportunities on our platform." />
</Helmet>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, pt: 2, pb: 8 }}>
          {/* Only render children once auth is hydrated */}
          {hydrated ? <Outlet /> : null}
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Layout;