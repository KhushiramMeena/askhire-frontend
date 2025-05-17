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

// Enhanced with structured data for rich search results
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

  // SEO-friendly meta tags based on dynamic content
  const metaTags = useMemo(() => {
    const jobTitles = featuredJobs
      .map(job => job.job_title || job.job_title || '')
      .filter(Boolean)
      .join(', ');
    
    // TypeScript-safe way to get unique companies
    const uniqueCompanies = Array.from(
      new Map(featuredJobs.map(job => [job.company_name || '', job.company_name || '']))
        .values()
    ).filter(Boolean).join(', ');
    
    return {
      title: "Askhire - Find Your Dream Job Today",
      description: `Find your dream job at top companies like ${uniqueCompanies || 'leading employers'}. Currently featuring ${jobTitles || 'exciting opportunities'}.`,
      keywords: `AskHire, jobs, career, employment, recruitment, hiring, job search, ${jobTitles}, ${uniqueCompanies}`
    };
  }, [featuredJobs]);

  useEffect(() => {
    // Fetch latest jobs
    fetchJobs(1, 3);
  }, [fetchJobs]);

  useEffect(() => {
    if (jobs.length > 0) {
      try {
        // Sort by posting date to show newest jobs first
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
        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.title} />
        <meta name="twitter:description" content={metaTags.description} />
        <link rel="canonical" href={window.location.href} />
        {featuredJobs.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={JobPostingSchema(featuredJobs)} />
        )}
      </Helmet>

      {/* Hero Section - Enhanced with responsive sizing */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1E3A8A 0%, #4F46E5 100%)', 
          color: 'white', 
          py: { xs: 6, sm: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/assets/hero-pattern.svg")', 
            opacity: 0.1,
            zIndex: 1,
          }
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            textAlign: 'center', 
            maxWidth: { xs: '100%', sm: 600, md: 700 }, 
            mx: 'auto',
            px: { xs: 2, sm: 0 }
          }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              sx={{ 
                fontWeight: 800, 
                mb: { xs: 2, sm: 4 },
                textShadow: '0 2px 10px rgba(0,0,0,0.15)',
                lineHeight: 1.2
              }}
            >
              Find Your Dream Job Today
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              sx={{ 
                mb: { xs: 4, sm: 6 }, 
                color: '#93C5FD',
                maxWidth: '85%',
                mx: 'auto',
                fontWeight: 400
              }}
            >
              Discover opportunities that match your skills and career goals.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                component={Link}
                to="/jobs"
                variant="contained"
                size={isMobile ? "medium" : "large"}
                aria-label="Browse all job listings"
                sx={{ 
                  backgroundColor: 'white', 
                  color: '#2563EB', 
                  fontWeight: 600,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  '&:hover': { 
                    backgroundColor: '#EFF6FF',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
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
      <Box sx={{ 
        py: { xs: 4, sm: 5, md: 6 }, 
        backgroundColor: '#F3F4F6',
        position: 'relative'
      }}>
        <Container>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            alignItems: isMobile ? 'flex-start' : 'center', 
            mb: { xs: 3, sm: 4 },
            gap: isMobile ? 2 : 0
          }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h2"
              sx={{ 
                fontWeight: 'bold',
                color: '#111827',
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
              aria-label="View all available jobs"
              endIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              sx={{ 
                color: '#2563EB',
                fontWeight: 600,
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
              height: { xs: 200, sm: 300 },
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
              aria-label="Featured job listings"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                flexWrap: 'wrap',
                gap: 3,
                width: '100%',
                justifyContent: { xs: 'center', md: 'space-between' }
              }}
            >
              {featuredJobs.map((job: any, index: number) => (
                <Box
                  key={job.id || index}
                  sx={{
                    width: isMobile ? '100%' : isTablet ? 'calc(50% - 12px)' : 'calc(33.333% - 16px)',
                    minWidth: '280px',
                    maxWidth: '100%',
                    flex: '1 1 auto',
                    transform: 'scale(1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
          <Box 
            sx={{ 
              mt: { xs: 4, sm: 6 },
              overflow: 'hidden',
              borderRadius: 2,
              width: '100%'
            }}
          >
            <AdBanner slotId="1234567890" format="leaderboard" />
          </Box>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: { xs: 5, md: 8 }, backgroundColor: 'white' }}>
        {/* <Container>
          <Typography 
            variant="h4" 
            component="h2"
            align="center"
            sx={{ 
              fontWeight: 'bold',
              mb: { xs: 4, md: 6 },
              color: '#111827'
            }}
          >
            Why Choose AskHire
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 4, md: 3 },
              justifyContent: 'center',
              mb: 4
            }}
          >
            {[
              {
                icon: "🔍",
                title: "Smart Matching",
                description: "Our AI-powered system connects you with jobs that match your skills and experience."
              },
              {
                icon: "⚡",
                title: "Fast Application",
                description: "Apply to multiple positions with just a few clicks using your saved profile."
              },
              {
                icon: "🌟",
                title: "Top Employers",
                description: "Access opportunities from industry-leading companies looking for talent like you."
              }
            ].map((feature, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  flex: 1
                }}
              >
                <Box sx={{ 
                  fontSize: '2.5rem', 
                  mb: 2,
                  height: 60,
                  width: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF'
                }}>
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  component="h3"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                >
                  {feature.description}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size={isMobile ? "medium" : "large"}
              sx={{
                backgroundColor: '#2563EB',
                fontWeight: 600,
                px: { xs: 3, sm: 5 },
                py: { xs: 1, sm: 1.5 },
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#1E40AF'
                }
              }}
            >
              Get Started Today
            </Button>
          </Box>
        </Container> */}
      <Container maxWidth="lg">
          <Typography 
            id="why-choose-heading"
            variant="h3" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 5, 
              textAlign: 'center',
              fontSize: { xs: '1.5rem', md: '1.75rem' }
            }}
          >
            Why Choose AskHire
          </Typography>

          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center'
            }}
          >
            {[
              {
                icon: <StarIcon sx={{ fontSize: 40, color: '#3B82F6' }} />,
                title: 'Top Companies',
                description: 'Connect with leading companies in tech, finance, healthcare and more.'
              },
              {
                icon: <TrendingIcon sx={{ fontSize: 40, color: '#3B82F6' }} />,
                title: 'Latest Opportunities',
                description: 'Access the newest job postings and internships updated daily.'
              },
              {
                icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#3B82F6' }} />,
                title: 'Verified Listings',
                description: 'All job listings are verified to ensure authenticity and quality.'
              }
            ].map((feature, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 20px)' },
                  border: '1px solid #E5E7EB',
                  borderRadius: 2
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>

      </Box>
    </>
  );
};

export default HomePage;
