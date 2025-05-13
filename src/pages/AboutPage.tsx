// src/pages/AboutPage.tsx

import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/common/AdBanner';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Askhire</title>
        <meta name="description" content="Learn more about Askhire - our mission, values, and the team behind the platform." />
      </Helmet>
      
      <Container sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            About Us
            <Box sx={{ width: '20%', height: '4px', backgroundColor: 'primary.main', mb: 2 }} />
          </Typography>
          
          {/* AdSense Banner */}
          <Box sx={{ mb: 4 }}>
            <AdBanner slotId="1234567890" format="leaderboard" />
          </Box>
          
          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              At Askhire, our mission is to connect talented professionals with their dream careers and help employers find the perfect candidates. We believe in creating meaningful connections that drive success for both job seekers and employers.
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Our team of dedicated professionals understands the challenges of the job market from both perspectives. We've been job seekers ourselves, facing the uncertainty and excitement of finding new opportunities. We've also been on the hiring side, searching for that perfect candidate who will help drive success.
            </Typography>
            
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Our Values
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
              mb: 5
            }}>
              <Box sx={{ 
                flex: { xs: '1 0 100%', sm: '1 0 calc(50% - 12px)' }, 
                bgcolor: 'background.default', 
                p: 2, 
                borderRadius: 1 
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quality
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We prioritize quality over quantity, ensuring that every job listing and candidate profile on our platform meets high standards.
                </Typography>
              </Box>
              
              <Box sx={{ 
                flex: { xs: '1 0 100%', sm: '1 0 calc(50% - 12px)' }, 
                bgcolor: 'background.default', 
                p: 2, 
                borderRadius: 1 
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Transparency
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We believe in honest, clear communication with our users, providing accurate information about jobs and companies.
                </Typography>
              </Box>
              
              <Box sx={{ 
                flex: { xs: '1 0 100%', sm: '1 0 calc(50% - 12px)' }, 
                bgcolor: 'background.default', 
                p: 2, 
                borderRadius: 1 
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Accessibility
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We strive to make our platform accessible to everyone, regardless of background or experience level.
                </Typography>
              </Box>
              
              <Box sx={{ 
                flex: { xs: '1 0 100%', sm: '1 0 calc(50% - 12px)' }, 
                bgcolor: 'background.default', 
                p: 2, 
                borderRadius: 1 
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Innovation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We continuously evolve our platform with new features and improvements to better serve our users' needs.
                </Typography>
              </Box>
            </Box>
            

            
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Join Our Community
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Whether you're looking for your next career move or searching for the perfect addition to your team, Askhire is here to help. Join thousands of job seekers and employers who trust our platform for their career and recruitment needs.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
            >
              <Button 
                component={RouterLink} 
                to="/register" 
                variant="contained" 
                color="primary" 
                size="large"
              >
                Create an Account
              </Button>
              <Button 
                component={RouterLink} 
                to="/contact" 
                variant="outlined" 
                color="inherit" 
                size="large"
              >
                Contact Us
              </Button>
            </Stack>
          </Box>
          
          {/* AdSense Banner */}
          <Box sx={{ mt: 4 }}>
            <AdBanner slotId="0987654321" format="leaderboard" />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AboutPage;