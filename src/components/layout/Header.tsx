// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton, 
  Container, 
  Menu, 
  MenuItem, 
  Avatar, 
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Work as WorkIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import askhire from '../../assets/askhire.svg'
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuthStore();
  
  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // User menu state
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const closeDrawer = () => {
    setDrawerOpen(false);
  };
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    closeDrawer();
  };
  
  // Check if the current route is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Navigation links
  const navLinks = [
    { text: 'Home', path: '/' },
    { text: 'Browse Jobs', path: '/jobs' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];
  
  // Get first letter of username for avatar
  const getAvatarLetter = () => {
    return user?.username ? user.username.charAt(0).toUpperCase() : 'U';
  };


    // Schema.org JSON-LD for navigation
  const navigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": navLinks.map(link => link.text),
    "url": navLinks.map(link => `${window.location.origin}${link.path}`)
  };
  

  
  return (
    <>
     <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(navigationSchema)}
        </script>
      </Helmet>
   
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
             
            <img src={askhire} alt="AskHire" />
            </RouterLink>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    mx: 1,
                    color: isActive(link.path) ? 'primary.main' : 'text.primary',
                    position: 'relative',
                    '&::after': isActive(link.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '20%',
                      width: '60%',
                      height: 2,
                      bgcolor: 'primary.main',
                    } : {}
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Authentication Buttons/Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              // User is logged in
              <>
                {!isMobile && (
                  <Button
                    onClick={handleUserMenuOpen}
                    sx={{ 
                      ml: 2,
                      textTransform: 'none',
                      color: 'text.primary'
                    }}
                    endIcon={<KeyboardArrowDownIcon />}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: 'primary.main', 
                        fontSize: '0.875rem',
                        mr: 1 
                      }}
                    >
                      {getAvatarLetter()}
                    </Avatar>
                    <Typography variant="body2">
                      {user?.username}
                    </Typography>
                  </Button>
                )}
                
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    elevation: 3,
                    sx: { width: 200, mt: 1 }
                  }}
                >
                  <MenuItem 
                    component={RouterLink} 
                    to="/profile"
                    onClick={handleUserMenuClose}
                    sx={{ gap: 1.5 }}
                  >
                    <PersonIcon fontSize="small" />
                    Profile
                  </MenuItem>
                  {/* <MenuItem 
                    component={RouterLink} 
                    to="/settings"
                    onClick={handleUserMenuClose}
                    sx={{ gap: 1.5 }}
                  >
                    <SettingsIcon fontSize="small" />
                    Settings
                  </MenuItem> */}
                  <Divider />
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ gap: 1.5 }}
                  >
                    <LogoutIcon fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // User is not logged in
              !isMobile && (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    sx={{ ml: 2 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    color="primary"
                    sx={{ ml: 2 }}
                  >
                    Register
                  </Button>
                </>
              )
            )}
            
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        PaperProps={{
          sx: { width: 280 }
        }}
      >
        <Box sx={{ pt: 2, pb: 2 }}>
          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40,
                  mr: 2
                }}
              >
                {getAvatarLetter()}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight={500}>{user?.username}</Typography>
                <Typography variant="body2" color="text.secondary">{user?.role}</Typography>
              </Box>
            </Box>
          )}
          
          <Divider />
          
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={closeDrawer}
                  selected={isActive(link.path)}
                >
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Divider />
          
          {isAuthenticated ? (
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/profile"
                  onClick={closeDrawer}
                >
                  <PersonIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                {/* <ListItemButton
                  component={RouterLink}
                  to="/settings"
                  onClick={closeDrawer}
                >
                  <SettingsIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Settings" />
                </ListItemButton> */}
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLogout}
                >
                  <LogoutIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2, gap: 2 }}>
              <Button
                component={RouterLink}
                to="/login"
                color="primary"
                variant="outlined"
                onClick={closeDrawer}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                color="primary"
                variant="contained"
                onClick={closeDrawer}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
     </>
  );
};

export default Header;