// src/pages/DMCAPage.tsx

import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/common/AdBanner';
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';

const DMCAPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>DMCA Policy | Askhire</title>
        <meta name="description" content="index, Learn about our DMCA policy and how to report copyright infringement on our platform." />
      </Helmet>
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            DMCA Policy
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Digital Millennium Copyright Act Notice and Takedown Procedure
          </Typography>
        </Box>
        
        {/* AdSense Banner */}
        {/* <Box sx={{ mb: 4 }}>
          <AdBanner slotId="1234567890" format="leaderboard" />
        </Box> */}
        
        <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 1 }}>
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body2">
              Last updated: May 10, 2025
            </Typography>
          </Alert>
          
          <Typography variant="body1" paragraph>
            Askhire respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond expeditiously to claims of copyright infringement that are reported to our designated copyright agent.
          </Typography>
          
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Copyright Infringement Notice
            </Typography>
            <Typography variant="body1" paragraph>
              If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on our platform, please notify our copyright agent as set forth in the DMCA. For your complaint to be valid under the DMCA, you must provide the following information in writing:
            </Typography>
            
            <List disablePadding sx={{ ml: 2 }}>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                  </Typography>
                } />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works are covered by a single notification, a representative list of such works.
                  </Typography>
                } />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material (providing URLs in the body of an email is the best way to help us locate content quickly).
                  </Typography>
                } />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and, if available, an email address.
                  </Typography>
                } />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
                  </Typography>
                } />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleOutlineIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                  </Typography>
                } />
              </ListItem>
            </List>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              How to Submit a DMCA Notice
            </Typography>
            
            <Typography variant="body1" paragraph>
              If we have added some content that belongs to you or your organization by mistake, we sincerely apologize. We assure you that this won't be repeated in the future. If you are the rightful owner of the content used on our website, please email us with the following information:
            </Typography>
            
            <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 1, my: 3 }}>
              <Typography variant="body1" paragraph fontWeight="medium">
                Please send your DMCA takedown notice to:
              </Typography>
              <Typography variant="body1" color="primary" fontWeight="bold">
                hello@askhire.in
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <TimerIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="body1">
                We will remove the infringing content within <strong>48 hours</strong> upon receipt of a valid DMCA notice.
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Counter-Notification
            </Typography>
            
            <Typography variant="body1" paragraph>
              If you believe that your content was removed in error and that you have the right to display your content, you may submit a counter-notification by sending an email to our designated agent containing the following information:
            </Typography>
            
            <List disablePadding sx={{ ml: 2 }}>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <InfoIcon color="info" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    Your physical or electronic signature.
                  </Typography>
                } />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <InfoIcon color="info" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to it was disabled.
                  </Typography>
                } />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <InfoIcon color="info" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled.
                  </Typography>
                } />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <InfoIcon color="info" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located, or if your address is outside of the United States, for any judicial district in which we may be found, and that you will accept service of process from the person who provided notification of copyright infringement or an agent of such person.
                  </Typography>
                } />
              </ListItem>
            </List>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1 }} /> Warning About False Claims
            </Typography>
            
            <Typography variant="body1" paragraph>
              Please be aware that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages. Don't make false claims! Please review the following before sending a DMCA notice:
            </Typography>
            
            <List disablePadding sx={{ ml: 2 }}>
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <WarningIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    Consider whether fair use, fair dealing, or a similar exception to copyright applies before filing a DMCA notice.
                  </Typography>
                } />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <WarningIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    Only send DMCA notices for works for which you own the copyright or are authorized to act on the copyright owner's behalf.
                  </Typography>
                } />
              </ListItem>
              
              <ListItem sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <WarningIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1">
                    Consider consulting an attorney before filing a DMCA notice if you have any questions about whether your content is infringing.
                  </Typography>
                } />
              </ListItem>
            </List>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Alert severity="info" sx={{ mt: 4 }}>
            <Typography variant="body1">
              This DMCA Policy is provided for informational purposes only and does not constitute legal advice. If you believe your copyrighted work is being infringed, or if you've received a DMCA notice, we recommend consulting with a licensed attorney.
            </Typography>
          </Alert>
        </Paper>
        
        {/* AdSense Banner */}
        {/* <Box sx={{ mt: 4 }}>
          <AdBanner slotId="0987654321" format="leaderboard" />
        </Box> */}
      </Container>
    </>
  );
};

export default DMCAPage;