
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/common/AdBanner';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Askhire</title>
        <meta name="description" content="index, Read our privacy policy to understand how we collect, use, and protect your personal information." />
      </Helmet>
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Privacy Policy
          </Typography>
        </Box>
        
        {/* AdSense Banner */}
        {/* <Box sx={{ mb: 4 }}>
          <AdBanner slotId="1234567890" format="leaderboard" />
        </Box> */}
        
        <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Last updated: May 1, 2025
          </Typography>
          
          <Box sx={{ color: 'text.secondary' }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Introduction
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to Askhire. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Information We Collect
            </Typography>
            <Typography variant="body1" paragraph>
              We may collect information about you in various ways, including:
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Personal Information:</strong> Name, email address, phone number, resume data, work history, and other information you provide when creating an account or profile.</Typography>} 
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Usage Data:</strong> Information about how you use our website, which pages you visit, and which features you use.</Typography>} 
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Device Information:</strong> Data about your device, including IP address, browser type, operating system, and other technical information.</Typography>} 
                />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              How We Use Your Information
            </Typography>
            <Typography variant="body1" paragraph>
              We may use the information we collect for various purposes, including:
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Providing, operating, and maintaining our services" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Matching job seekers with relevant job opportunities" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Improving, personalizing, and expanding our services" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Communicating with you about updates, security alerts, and other information" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Analyzing usage patterns and trends to enhance user experience" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Preventing fraudulent activity and enhancing security" />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Disclosure of Your Information
            </Typography>
            <Typography variant="body1" paragraph>
              We may share your information with:
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Employers and Recruiters:</strong> If you're a job seeker, with your consent, we may share your profile with employers and recruiters.</Typography>} 
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Service Providers:</strong> We may share your information with third-party vendors who provide services on our behalf.</Typography>} 
                />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={<Typography variant="body1"><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</Typography>} 
                />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Cookies and Tracking Technologies
            </Typography>
            <Typography variant="body1" paragraph>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Google AdSense
            </Typography>
            <Typography variant="body1" paragraph>
              We use Google AdSense to display advertisements on our website. Google AdSense may use cookies and web beacons to collect information about your visits to this and other websites to provide targeted advertisements. If you would like more information about this practice and to know your choices about not having this information used by Google AdSense, please visit Google's privacy policy.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Data Security
            </Typography>
            <Typography variant="body1" paragraph>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Your Data Protection Rights
            </Typography>
            <Typography variant="body1" paragraph>
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="The right to access personal information we hold about you" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="The right to request correction of inaccurate data" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="The right to request deletion of your data" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="The right to restrict or object to our processing of your data" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="The right to data portability" />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Children's Privacy
            </Typography>
            <Typography variant="body1" paragraph>
              Our service is not directed to anyone under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and you believe your child has provided us with personal information, please contact us.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1" paragraph>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about this Privacy Policy, please contact us at:
            </Typography>
            <List disablePadding>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemText primary="Email: hello@askhire.in" />
              </ListItem>
            </List>
          </Box>
        </Paper>
        
        {/* AdSense Banner */}
        {/* <Box sx={{ mt: 4 }}>
          <AdBanner slotId="0987654321" format="leaderboard" />
        </Box> */}
      </Container>
    </>
  );
};

export default PrivacyPolicyPage;