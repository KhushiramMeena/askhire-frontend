import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import JobCard from '../components/job/JobCard';
import Spinner from '../components/common/Spinner';
import AdBanner from '../components/common/AdBanner';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Typography,
  Container,
  useMediaQuery,
  Theme,
  Paper,
} from '@mui/material';

import { 
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';

// Enhanced structured data for rich search results
const JobPostingSchema = (jobs: any[]) => {
  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": jobs.map((job, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "JobPosting",
          "title": job.job_title || job.title || '',
          "description": job.description || '',
          "datePosted": job.post_date || '',
          "employmentType": job.employment_type || '',
          "hiringOrganization": {
            "@type": "Organization",
            "name": job.company_name || '',
            "logo": job.company_logo || ""
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": job.location || ''
            }
          }
        }
      }))
    })
  };
};

const HomePage: React.FC = () => {
  const { jobs, loading, error, fetchJobs } = useJobStore();
  const [featuredJobs, setFeaturedJobs] = useState<typeof jobs>([]);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));

  // Enhanced SEO-friendly meta tags with proper keyword distribution
  const metaTags = useMemo(() => {
    const jobTitles = featuredJobs
      .map(job => job.job_title || job.job_title || '')
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');
    
    const uniqueCompanies = Array.from(
      new Map(featuredJobs.map(job => [job.company_name || '', job.company_name || '']))
        .values()
    ).filter(Boolean).slice(0, 3).join(', ');
    
    const enhancedDescription = `Find your dream job at top companies like ${uniqueCompanies || 'Barclays, Sage, Expedia Group'}. Currently featuring ${jobTitles || 'Software Engineer, Data Analyst, Product Manager'} roles. Browse jobs, build your career, and connect with leading employers in India.`;
    
    return {
      title: "Find Your Dream Job Today - AskHire | Jobs, Software Engineer, Skills",
      description: enhancedDescription,
      keywords: `jobs, software engineer, skills, browse jobs, career, employment, recruitment, hiring, job search, ${jobTitles}, ${uniqueCompanies}, AskHire, find jobs, dream job`
    };
  }, [featuredJobs]);

  useEffect(() => {
    // Preload critical resources for better LCP
    const preloadCriticalResources = () => {
      // Preload hero background if using images
      // const heroImage = new Image();
      // heroImage.src = '/assets/hero-pattern.svg';
      
      // Preload featured job images
      featuredJobs.forEach(job => {
        if (job.company_logo) {
          const img = new Image();
          img.src = job.company_logo;
        }
      });
    };
    
    preloadCriticalResources();
    fetchJobs(1, 3);
  }, [fetchJobs]);

  useEffect(() => {
    if (jobs.length > 0) {
      try {
        const sortedJobs = [...jobs].sort(
          (a, b) => {
            const dateA = new Date(a.post_date || 0).getTime();
            const dateB = new Date(b.post_date || 0).getTime();
            return dateB - dateA;
          }
        );
        setFeaturedJobs(sortedJobs.slice(0, 3));
      } catch (e) {
        console.error('Error sorting jobs:', e);
        setFeaturedJobs(jobs.slice(0, 3));
      }
    }
  }, [jobs]);

  return (
    <>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="keywords" content={metaTags.keywords} />
        
        {/* Enhanced Open Graph tags */}
        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://askhire.in/" />
        <meta property="og:image" content="https://askhire.in/logo512.png" />
        <meta property="og:site_name" content="AskHire" />
        <meta property="og:locale" content="en_US" />
        
        {/* Enhanced Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.title} />
        <meta name="twitter:description" content={metaTags.description} />
        <meta name="twitter:image" content="https://askhire.in/logo512.png" />
        <meta name="twitter:site" content="@AskHire" />
        <meta name="twitter:creator" content="@AskHire" />
        
        {/* Remove duplicate canonical - only use one */}
        <link rel="canonical" href="https://askhire.in/" />
        
        {/* Preload critical resources for better LCP */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" as="style" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional meta tags for SEO */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="author" content="AskHire" />
        <meta name="revisit-after" content="1 days" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <meta name="geo.placename" content="Bengaluru, Karnataka, India" />
        
        {featuredJobs.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={JobPostingSchema(featuredJobs)} />
        )}
        
        {/* Additional structured data for organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AskHire",
            "url": "https://askhire.in",
            "logo": "https://askhire.in/logo512.png",
            "description": "Find your dream job at top companies in India. Connect with leading employers and discover exciting career opportunities.",
            "sameAs": [
              "https://twitter.com/AskHire"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": "English"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section - Optimized for LCP */}
      <Box 
        component="section"
        sx={{ 
          background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', 
          color: 'white', 
          py: { xs: 5, sm: 7, md: 9 },
          position: 'relative',
          overflow: 'hidden',
          // Optimize for LCP - avoid background images that block rendering
          willChange: 'transform',
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            textAlign: 'center', 
            maxWidth: { xs: '100%', sm: 600, md: 700 }, 
            mx: 'auto',
            px: { xs: 2, sm: 0 }
          }}>
            {/* CRITICAL FIX: Proper H1 heading with keywords */}
            <Typography 
              component="h1"
              variant="h2"
              sx={{ 
                fontWeight: 800, 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                lineHeight: { xs: 1.2, sm: 1.1 },
                // Optimize font loading for LCP
                fontDisplay: 'swap'
              }}
            >
              Find Your Dream Job Today
            </Typography>
            <Typography 
              component="p"
              variant="h6"
              sx={{ 
                mb: { xs: 3, sm: 4 }, 
                color: '#93C5FD',
                maxWidth: '90%',
                mx: 'auto',
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Discover opportunities in software engineering, browse jobs at top companies, and build your career with AskHire.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                component={Link}
                to="/jobs"
                variant="contained"
                size={isMobile ? "medium" : "large"}
                aria-label="Browse all job listings and software engineer positions"
                sx={{ 
                  backgroundColor: 'white', 
                  color: '#2563EB', 
                  fontWeight: 600,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.2, sm: 1.5 },
                  borderRadius: '8px',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  '&:hover': { 
                    backgroundColor: '#EFF6FF',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Browse Jobs
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured Jobs Section */}
      <Box 
        component="section"
        sx={{ 
          py: { xs: 4, sm: 5, md: 6 }, 
          backgroundColor: '#F9FAFB',
        }}
      >
        <Container>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center', 
            mb: { xs: 3, sm: 4 },
            gap: isMobile ? 2 : 0
          }}>
            {/* CRITICAL FIX: Proper H2 heading with keywords */}
            <Typography 
              component="h2"
              variant="h4"
              sx={{ 
                fontWeight: 'bold',
                color: '#111827',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 3,
                  backgroundColor: '#2563EB',
                  borderRadius: 4
                }
              }}
            >
              Featured Jobs
            </Typography>
            <Button 
              component={Link}
              to="/jobs"
              variant="text"
              aria-label="View all software engineer and other job opportunities"
              endIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              sx={{ 
                color: '#2563EB',
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.04)'
                }
              }}
            >
              View All Jobs
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: { xs: 200, sm: 250 },
              width: '100%'
            }}>
              <Spinner />
            </Box>
          ) : error ? (
            <Paper
              elevation={0}
              sx={{ 
                backgroundColor: '#FEE2E2', 
                borderLeft: '4px solid #EF4444', 
                padding: 3, 
                borderRadius: 1,
                mb: 2
              }}
            >
              <Typography sx={{ color: '#B91C1C' }}>
                Error loading jobs. Please try again later.
              </Typography>
            </Paper>
          ) : featuredJobs.length > 0 ? (
            <Box
              role="list"
              aria-label="Featured software engineer and other job listings"
              sx={{
                display: 'grid',
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(3, 1fr)' 
                },
                gap: { xs: 2, sm: 2.5, md: 3 },
                width: '100%'
              }}
            >
              {featuredJobs.map((job: any, index: number) => (
                <Box
                  key={job.id || index}
                  sx={{
                    transform: 'scale(1)',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    }
                  }}
                >
                  <JobCard job={job} />
                </Box>
              ))}
            </Box>
          ) : (
            <Paper
              elevation={1}
              sx={{ 
                backgroundColor: 'white', 
                padding: 4, 
                textAlign: 'center',
                borderRadius: 2
              }}
            >
              <Typography>No featured jobs available at the moment.</Typography>
              <Button
                component={Link}
                to="/post-job"
                variant="outlined"
                sx={{ mt: 2, color: '#2563EB', borderColor: '#2563EB' }}
              >
                Post a Job
              </Button>
            </Paper>
          )}

          {/* AdSense Banner */}
          {/* <Box 
            sx={{ 
              mt: { xs: 4, sm: 5 },
              overflow: 'hidden',
              borderRadius: 2,
              width: '100%'
            }}
          >
            <AdBanner slotId="1234567890" format="leaderboard" />
          </Box> */}
        </Container>
      </Box>

      {/* Why Choose AskHire Section - Enhanced for SEO */}
      <Box 
        component="section"
        sx={{ py: { xs: 5, md: 7 }, backgroundColor: 'white' }}
      >
        <Container maxWidth="lg">
          <Typography 
            component="h2"
            variant="h4"
            sx={{ 
              fontWeight: 'bold', 
              mb: { xs: 4, md: 5 }, 
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              color: '#111827'
            }}
          >
            Why Choose AskHire for Your Career
          </Typography>

          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 3, md: 4 },
              mb: 4
            }}
          >
            {[
              {
                icon: <StarIcon sx={{ fontSize: 40, color: '#3B82F6' }} />,
                title: 'Top Companies',
                description: 'Connect with leading companies in tech, finance, healthcare and more industries across India.'
              },
              {
                icon: <TrendingIcon sx={{ fontSize: 40, color: '#3B82F6' }} />,
                title: 'Latest Opportunities',
                description: 'Access the newest software engineer jobs, internships and career opportunities updated daily.'
              },
              {
                icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#3B82F6' }} />,
                title: 'Verified Listings',
                description: 'All job listings are verified to ensure authenticity, quality and genuine career opportunities.'
              }
            ].map((feature, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  textAlign: 'center',
                  border: '1px solid #E5E7EB',
                  borderRadius: 2,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography 
                  component="h3"
                  variant="h6" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Enhanced CTA section */}
          <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 5 } }}>
            <Typography 
              component="p"
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
            >
              Join thousands of professionals who found their dream jobs through AskHire. 
              Start browsing opportunities today.
            </Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size={isMobile ? "medium" : "large"}
              aria-label="Register to start your job search and career journey"
              sx={{
                backgroundColor: '#2563EB',
                fontWeight: 600,
                px: { xs: 3, sm: 5 },
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: '8px',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                '&:hover': {
                  backgroundColor: '#1E40AF'
                }
              }}
            >
              Get Started Today
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;