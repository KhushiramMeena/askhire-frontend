import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Container, Divider } from '@mui/material';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';
import askhire from '../../assets/askhire.svg'
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';
import { FOOTER_LINKS, SITE_INFO } from '../../utils/constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  // All links from constants
  const companyLinks = FOOTER_LINKS.COMPANY.LINKS;
  const legalLinks = FOOTER_LINKS.LEGAL.LINKS;
  
  // Create a flattened version of all links
  const allLinks = [
    { text: 'Home', path: '/' }, 
    { text: 'Browse Jobs', path: '/jobs' },
    ...companyLinks.map(link => ({ text: link.LABEL, path: link.HREF })),
    ...legalLinks.map(link => ({ text: link.LABEL, path: link.HREF }))
  ];
  
  return (
    <Box component="footer" sx={{ 
      bgcolor: '#2d3748', 
      color: 'white', 
      py: { xs: 1.5, sm: 2 }
    }}>
      <Container maxWidth="lg">
        {/* Main footer content in single row */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          py: 1
        }}>
          {/* Logo and social icons side by side */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            width: { xs: '100%', sm: 'auto' },
            mb: { xs: 1, sm: 0 }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={askhire} alt={SITE_INFO.NAME} />
            </Box>
            
            {/* Social icons */}
            <Box sx={{ display: 'flex', ml: { xs: 0, sm: 0 } }}>
              <IconButton size="small" href="https://t.me/AskhireOfficial" color="inherit" aria-label="Telegram" sx={{ p: 0.5 }}>
                <TelegramIcon fontSize="small" />
              </IconButton>
            
              <IconButton size="small" href="https://www.linkedin.com/company/askhire/" color="inherit" aria-label="LinkedIn" sx={{ p: 0.5 }}>
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton size="small" href="mailto:hello@askhire.in" color="inherit" aria-label="Email" sx={{ p: 0.5 }}>
                <EmailIcon fontSize="small" />
                <p style={{ color: '#a0aec0', marginLeft: 4, fontSize:'4' }}>hello@askhire.in</p>
              </IconButton>
            </Box>
          </Box>
          
          {/* Links in a horizontal row */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              gap: { xs: '8px 16px', sm: '0px 16px' }
            }}
          >
            {allLinks.map(link => (
              <Link 
                key={link.text} 
                to={link.path}
                style={{ 
                  textDecoration: 'none', 
                  color: '#edf2f7',
                  fontSize: '0.8rem'
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    transition: 'color 0.2s', 
                    '&:hover': { color: '#ffffff' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  {link.text}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>

        {/* Very thin divider */}
        <Divider sx={{ borderColor: '#4a5568', opacity: 0.5, my: 0.5 }} />

        {/* Copyright - ultra-compact */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          py: 0.5
        }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#a0aec0', 
              fontSize: '0.75rem' 
            }}
          >
            {SITE_INFO.COPYRIGHT}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;