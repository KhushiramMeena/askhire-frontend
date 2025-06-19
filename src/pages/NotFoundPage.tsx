import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

const NotFoundPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const popularLinks = [
    {
      title: 'Browse Jobs',
      description: 'Find Career opportunities',
      icon: <WorkIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/jobs',
      color: 'primary.main'
    },
    {
      title: 'Home',
      description: 'Return to our homepage',
      icon: <HomeIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      path: '/',
      color: 'success.main'
    },
    {
      title: 'Search Jobs',
      description: 'Use our advanced job search',
      icon: <SearchIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      path: '/jobs',
      color: 'info.main'
    },
    {
      title: 'Contact Us',
      description: 'Get help from our support team',
      icon: <EmailIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      path: '/contact',
      color: 'warning.main'
    }
  ];

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | AskHire</title>
        <meta name="description" content="Sorry, the page you're looking for doesn't exist. Browse our job listings or return to the homepage to find software engineer and tech opportunities." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://askhire.in/404" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="404 - Page Not Found | AskHire" />
        <meta property="og:description" content="The page you're looking for doesn't exist. Find job opportunities on AskHire." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://askhire.in/404" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="404 - Page Not Found | AskHire" />
        <meta name="twitter:description" content="The page you're looking for doesn't exist. Find job opportunities on AskHire." />
        
        {/* Structured data for 404 page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "404 - Page Not Found",
            "description": "The requested page could not be found",
            "url": "https://askhire.in/404",
            "mainEntity": {
              "@type": "Organization",
              "name": "AskHire",
              "url": "https://askhire.in"
            }
          })}
        </script>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          {/* Large 404 Display */}
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              mb: 2
            }}
          >
            404
          </Typography>

          {/* Main heading */}
          <Typography
            component="h2"
            variant="h3"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' }
            }}
          >
            Page Not Found
          </Typography>

          {/* Description */}
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{
              maxWidth: 600,
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            Oops! The page you're looking for doesn't exist or has been moved. 
            Don't worry, you can find what you're looking for using the links below.
          </Typography>

          {/* Action buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2, 
              justifyContent: 'center',
              mb: 6
            }}
          >
            <Button
              component={Link}
              to="/"
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              Go to Homepage
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              Go Back
            </Button>
          </Box>
        </Box>

        {/* Popular links section */}
        <Box>
          <Typography
            component="h3"
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 4,
              color: 'text.primary'
            }}
          >
            Popular Pages
          </Typography>

          <Grid container spacing={3}
          sx={{ 
      justifyContent: 'center',
      alignItems: 'stretch' // Ensures all items have the same height
    }}
          >
            {popularLinks.map((link, index) => (
              <Grid  key={index}
              sx={{
          display: 'flex', // Ensures the Grid item stretches to full height
        }}
              >
                   <Paper
                    component={Link}
                    to={link.path}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      textDecoration: 'none',
                      width: '100%', // Full width within the Grid item
                      height: '100%', // Full height for consistent sizing
                      minHeight: { xs: 'auto', sm: 200 }, // Minimum height for consistency
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center', // Center content vertically
                      transition: 'all 0.3s ease',
                      border: `2px solid transparent`,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        borderColor: link.color,
                        boxShadow: `0 8px 25px -8px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`
                      }
                    }}
                    elevation={1}
                  >
                  <Box sx={{ mb: 2 }}>
                    {link.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.primary'
                    }}
                  >
                    {link.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.5 }}
                  >
                    {link.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Help section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Paper
            sx={{
              p: 4,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper'
            }}
          >
            <Typography
              component="h3"
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Still can't find what you're looking for?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
            >
              If you believe this is an error or you were directed here from another site, 
              please let us know so we can fix it.
            </Typography>
            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              startIcon={<EmailIcon />}
              sx={{ fontWeight: 600 }}
            >
              Report This Issue
            </Button>
          </Paper>
        </Box>

        {/* SEO content */}
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}
          >
            While you're here, explore our extensive job listings including software engineer positions, 
            tech roles, and career opportunities with top companies across India. Use our advanced search 
            and filtering options to find the perfect job that matches your skills and preferences.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default NotFoundPage;