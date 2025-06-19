// src/routes.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Box, CircularProgress } from '@mui/material';

// Layout component
const Layout = lazy(() => import('./components/layout/Layout'));

// Main page components with lazy loading for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const JobPostEmail = lazy(() => import('./pages/JobPostEmail'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const PostJobPage = lazy(() => import('./pages/PostJobPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const DMCAPage = lazy(() => import('./pages/DMCA'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

// Import the new NotFoundPage
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Enhanced loading fallback component
// const PageLoader: React.FC = () => (
//   <Box 
//     sx={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '50vh',
//       flexDirection: 'column',
//       gap: 2
//     }}
//   >
//     <CircularProgress color="primary" size={40} />
//     <Box
//       sx={{
//         width: 40,
//         height: 4,
//         backgroundColor: 'primary.main',
//         borderRadius: 2,
//         animation: 'pulse 1.5s ease-in-out infinite'
//       }}
//     />
//   </Box>
// );

// Protected route wrapper component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    // <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="jobs" element={<JobsPage />} />
          {/* <Route path="/jobs-with-recruiter-email" element={<JobPostEmail />} /> */}
          <Route path="job/:id/:slug" element={<JobDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-of-service" element={<TermsOfServicePage />} />
          <Route path="dmca" element={<DMCAPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route 
            path="post-job" 
            element={
              <ProtectedRoute>
                <PostJobPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy error page route (keep for backward compatibility) */}
          <Route path="error" element={<ErrorPage />} />
          
          {/* CRITICAL FIX: Custom 404 error page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    // </Suspense>
  );
};

export default AppRoutes;