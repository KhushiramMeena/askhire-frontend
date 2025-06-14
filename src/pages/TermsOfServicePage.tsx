// src/pages/TermsOfServicePage.tsx

import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/common/AdBanner';
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const TermsOfServicePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Askhire</title>
        <meta name="description" content="index, Read the terms and conditions for using Askhire services." />
      </Helmet>
      
      <Container sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Terms of Service
          </Typography>
          
          {/* AdSense Banner */}
          <Box sx={{ mb: 4 }}>
            <AdBanner slotId="1234567890" format="leaderboard" />
          </Box>
          
          <Box sx={{ px: { xs: 0, md: 0 } }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Last updated: May 1, 2025
            </Typography>
            
            <Box sx={{ color: 'text.secondary' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                1. Acceptance of Terms
              </Typography>
              <Typography variant="body1" paragraph>
                By accessing or using Askhire's website, services, or applications ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                2. Description of Services
              </Typography>
              <Typography variant="body1" paragraph>
                Askhire provides an online platform that connects job seekers with employers and allows employers to post job openings. Our Services may include job listings, resume posting, employer profiles, job applications, and other related features.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                3. User Accounts
              </Typography>
              <Typography variant="body1" paragraph>
                To access certain features of our Services, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating an account and to update your information to keep it accurate and current.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                4. User Content
              </Typography>
              <Typography variant="body1" paragraph>
                When you submit content to our Services, including job listings, resumes, profiles, and other materials ("User Content"), you grant us a non-exclusive, worldwide, royalty-free license to use, copy, modify, and display that User Content in connection with our Services.
              </Typography>
              <Typography variant="body1" paragraph>
                You represent and warrant that:
              </Typography>
              <List disablePadding sx={{ pl: 2, mb: 2 }}>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="You own or have the right to use and share the User Content" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="The User Content does not infringe on the rights of any third party" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="The User Content complies with these Terms and all applicable laws" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
              </List>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                5. Prohibited Conduct
              </Typography>
              <Typography variant="body1" paragraph>
                You agree not to:
              </Typography>
              <List disablePadding sx={{ pl: 2, mb: 2 }}>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="Use our Services for any illegal purpose" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="Post false, misleading, or fraudulent content" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="Impersonate any person or entity" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="Harass, abuse, or harm others" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="Interfere with or disrupt our Services" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="Attempt to gain unauthorized access to our Services" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="Collect or store personal data about others without their consent" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="Post content that is discriminatory, offensive, or inappropriate" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
              </List>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                6. Intellectual Property
              </Typography>
              <Typography variant="body1" paragraph>
                The Askhire name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Askhire or its affiliates. You may not use these marks without our prior written permission.
              </Typography>
              <Typography variant="body1" paragraph>
                All content, features, and functionality of our Services, including text, graphics, logos, icons, images, and software, are the property of Askhire or its licensors and are protected by copyright, trademark, and other intellectual property laws.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                7. Third-Party Links and Services
              </Typography>
              <Typography variant="body1" paragraph>
                Our Services may contain links to third-party websites or services. We are not responsible for the content or practices of these third-party websites or services, and linking to them does not imply our endorsement or affiliation.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                8. Disclaimer of Warranties
              </Typography>
              <Typography variant="body1" paragraph>
                Our Services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee the accuracy, completeness, or reliability of any content or information provided through our Services.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                9. Limitation of Liability
              </Typography>
              <Typography variant="body1" paragraph>
                To the maximum extent permitted by law, Askhire and its affiliates, officers, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of our Services.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                10. Indemnification
              </Typography>
              <Typography variant="body1" paragraph>
                You agree to indemnify and hold harmless Askhire and its affiliates, officers, employees, agents, and licensors from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or in connection with your use of our Services or violation of these Terms.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                11. Termination
              </Typography>
              <Typography variant="body1" paragraph>
                We may terminate or suspend your access to our Services at any time, with or without notice, for any reason, including if we believe you have violated these Terms. Upon termination, your right to use our Services will immediately cease.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                12. Changes to Terms
              </Typography>
              <Typography variant="body1" paragraph>
                We may modify these Terms at any time by posting the revised Terms on our website. Your continued use of our Services after the effective date of the revised Terms constitutes your acceptance of the changes.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                13. Governing Law
              </Typography>
              <Typography variant="body1" paragraph>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </Typography>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                14. Contact Information
              </Typography>
              <Typography variant="body1" paragraph>
                If you have any questions about these Terms, please contact us at:
              </Typography>
              <List disablePadding sx={{ pl: 2, mb: 2 }}>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <ListItemText primary="Email: hello@askhire.in" primaryTypographyProps={{ variant: 'body1' }} />
                </ListItem>
              </List>
            </Box>
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

export default TermsOfServicePage;