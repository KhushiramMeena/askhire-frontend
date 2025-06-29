// src/pages/ContactPage.tsx

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/common/AdBanner';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  CircularProgress,
  Link
} from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';


const ContactPage: React.FC = () => {


  return (
    <>
          <Helmet>
        <title>Contact Us - AskHire | Get Support for Job Search</title>
        <meta name="description" content="Contact AskHire support team for help with job search or technical issues. We're here to help you find your dream career." />
        <link rel="canonical" href="https://askhire.in/contact" />
      </Helmet>

      <Container sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>

          {/* AdSense Banner */}
          {/* <Box sx={{ mb: 4 }}>
            <AdBanner slotId="1234567890" format="leaderboard" />
          </Box> */}

          <Box sx={{ mb: 4 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4
            }}>
              {/* Contact Info Column */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Contact us :
                  <Box sx={{ width: '20%', height: '4px', backgroundColor: 'primary.main', mb: 2 }} />
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Have questions or feedback? We'd love to hear from you. Send Email and our team will get back to you as soon as possible.
                </Typography>

                <Box sx={{ mt: 4 }}>
                  <Stack direction="row" spacing={4}>


                    <Link href="https://t.me/AskhireOfficial" color="inherit" sx={{ '&:hover': { color: 'primary.main' } }}>
                      <TelegramIcon fontSize="large" sx={{ color: 'primary.main', mr: 1.5, mt: 0.5 }} />

                    </Link>
                    <Link href="https://www.linkedin.com/company/askhire/" color="inherit" sx={{ '&:hover': { color: 'primary.main' } }}>
                      <LinkedInIcon fontSize="large" sx={{ color: 'primary.main', mr: 1.5, mt: 0.5 }} />

                    </Link>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <EmailIcon fontSize="large" sx={{ color: 'primary.main', mr: 1.5, mt: 0.2 }} />
                      <Box>
                        <Typography fontWeight="medium" sx={{ color: 'text.secondary', mr: 1.5, mt: 0.9 }}>Email: hello@askhire.in</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Box>

            </Box>
          </Box>

          {/* AdSense Banner */}
          {/* <Box sx={{ mt: 4 }}>
            <AdBanner slotId="0987654321" format="leaderboard" />
          </Box> */}
        </Box>
      </Container>
    </>
  );
};

export default ContactPage;