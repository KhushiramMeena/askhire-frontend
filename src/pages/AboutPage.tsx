import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/common/AdBanner';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import TelegramIcon from '@mui/icons-material/Telegram';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Askhire - Job Listing Platform</title>
        <meta
          name="description"
          content="Learn more about Askhire - a modern job portal connecting talented professionals with top employers. Discover our mission, values, and team."
        />
        <meta name="keywords" content="job portal, recruitment, hire professionals, find jobs online, Askhire, job seekers, employers, hiring platform" />
        <meta property="og:title" content="About Us | Askhire" />
        <meta property="og:description" content="Discover Askhire’s mission to connect job seekers with employers. Learn how we’re transforming recruitment with innovation and accessibility." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.askhire.in/about" />
        <meta property="og:site_name" content="Askhire" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Askhire" />
        <meta name="twitter:description" content="Askhire is a leading platform for job seekers and recruiters. Learn more about what makes us different." />
      </Helmet>

      <Container sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }} component="section">
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            About Us
            <Box sx={{ width: '20%', height: '4px', backgroundColor: 'primary.main', mb: 2 }} />
          </Typography>

          {/* AdSense Banner */}
          <Box sx={{ mb: 4 }}>
            <AdBanner slotId="1234567890" format="leaderboard" />
          </Box>

          <Box sx={{ mb: 5 }} component="article">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              At <strong>Askhire</strong>, our mission is to simplify hiring by connecting talented professionals with the right job opportunities. As a modern <strong>job portal</strong>, we aim to empower both job seekers and recruiters by offering a reliable and user-friendly <strong>recruitment platform</strong>.
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We understand the job market challenges. That’s why Askhire brings transparency, accessibility, and innovation to the hiring process. Whether you're searching for jobs online or looking to hire top talent, we’re here to help.
            </Typography>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Our Values
            </Typography>

            <Box
              sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 5 }}
              component="section"
            >
              {[
                {
                  title: 'Quality',
                  desc: 'We prioritize high-quality job listings and verified candidate profiles, ensuring a trustworthy platform for all users.'
                },
                {
                  title: 'Transparency',
                  desc: 'Clear communication and honest information about companies and roles help job seekers make informed decisions.'
                },
                {
                  title: 'Accessibility',
                  desc: 'Our platform is inclusive, providing equal opportunities for people from all backgrounds and experience levels.'
                },
                {
                  title: 'Innovation',
                  desc: 'We continuously update Askhire with new features to improve the recruitment experience for everyone.'
                }
              ].map(({ title, desc }) => (
                <Box
                  key={title}
                  sx={{
                    flex: { xs: '1 0 100%', sm: '1 0 calc(50% - 12px)' },
                    bgcolor: 'background.default',
                    p: 2,
                    borderRadius: 1
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {desc}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Join Our Community
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Whether you're a professional looking for your next opportunity or a company looking to grow your team, Askhire is your trusted partner. Join thousands of users leveraging our platform to transform their hiring journey.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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

              <Button
                variant="outlined"
                color="inherit"
                size="large"
                href="https://t.me/AskhireOfficial"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<TelegramIcon />}
              >
                Join our Telegram
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
