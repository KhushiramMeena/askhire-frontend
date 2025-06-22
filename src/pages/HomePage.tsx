import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import JobCard from '../components/job/JobCard';
import Spinner from '../components/common/Spinner';
import AdBanner from '../components/common/AdBanner';
import { Helmet } from 'react-helmet-async';
import '../css/pages/HomePage.css';
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
        className="hero-section"
        sx={{ py: { xs: 5, sm: 7, md: 9 } }}
      >
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Box className="hero-content" 
            sx={{ px: { xs: 2, sm: 0 } }}>
            {/* CRITICAL FIX: Proper H1 heading with keywords */}
                          <Typography 
              component="h1"
              variant="h2"
              className="hero-title"
              sx={{ mb: { xs: 2, sm: 3 } }}
            >
              Find Your Dream Job Today
            </Typography>
                          <Typography 
              component="p"
              variant="h6"
              className="hero-subtitle"
              sx={{ mb: { xs: 3, sm: 4 } }}
            >
              Discover opportunities in software engineering, browse jobs at top companies, and build your career with AskHire.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                component={Link}
                to="/jobs"
                variant="contained"
                size={isMobile ? "medium" : "large"}
                className="hero-button"
                aria-label="Browse all job listings and software engineer positions"
                sx={{ 
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.2, sm: 1.5 }
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
            <Box
              sx={{ 
                backgroundColor: '#FEE2E2', 
                borderLeft: '4px solid #EF4444', 
                padding: 3, 
                borderRadius: 1,
                mb: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography sx={{ color: '#B91C1C' }}>
                Error loading jobs. Please try again later.
              </Typography>
            </Box>
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
            <Box
              sx={{ 
                backgroundColor: 'white', 
                padding: 4, 
                textAlign: 'center',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
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
            </Box>
          )}

          {/* AdSense Banner */}
          {/* <Box className="ad-container">
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
              <Box
                key={index}
                sx={{
                  p: { xs: 3, sm: 4 },
                  textAlign: 'center',
                  border: '1px solid #E5E7EB',
                  borderRadius: 2,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                  backgroundColor: 'background.paper'
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
              </Box>
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

      {/* Job Seeker Resources Section - Added high-value content */}
      <Box 
        component="section"
        sx={{ 
          py: { xs: 5, md: 7 }, 
          backgroundColor: '#F5F7FA'
        }}
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
            Job Seeker Resources
          </Typography>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2563EB' }}>
              Resume Building Tips for Software Engineers
            </Typography>
            <Typography variant="body1" paragraph>
              Creating an effective resume is crucial in today's competitive job market. For software engineers and IT professionals, highlighting the right skills and experiences can significantly increase your chances of landing interviews. Here are some expert tips:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 4 }}>
              <Typography component="li" variant="body1" paragraph>
                <strong>Showcase your technical skills:</strong> List programming languages, frameworks, and tools you're proficient in. Be specific about your experience level with each technology.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Highlight relevant projects:</strong> Include details of significant projects, emphasizing your role, technologies used, and quantifiable results achieved.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Demonstrate problem-solving abilities:</strong> Employers value candidates who can tackle complex challenges. Describe specific problems you've solved and the approaches you took.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Include certifications:</strong> Relevant certifications can validate your skills and demonstrate your commitment to professional development.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2563EB' }}>
              Interview Preparation Strategies
            </Typography>
            <Typography variant="body1" paragraph>
              Preparing thoroughly for job interviews can give you a significant advantage. For technical roles, interviews often involve both technical assessments and behavioral questions. Consider these strategies:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" variant="body1" paragraph>
                <strong>Research the company:</strong> Understand the company's products, services, culture, and recent developments to tailor your responses accordingly.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Practice coding challenges:</strong> Familiarize yourself with common algorithms and data structures. Platforms like LeetCode and HackerRank offer excellent practice problems.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Prepare for behavioral questions:</strong> Use the STAR method (Situation, Task, Action, Result) to structure your responses to behavioral questions.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Prepare thoughtful questions:</strong> Having insightful questions demonstrates your genuine interest in the role and company.
              </Typography>
            </Box>
          </Box>

          {/* Additional AdSense Banner */}
          {/* <Box sx={{ my: 5 }}>
            <AdBanner slotId="9876543210" format="rectangle" />
          </Box> */}

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2563EB' }}>
              Career Development in Tech
            </Typography>
            <Typography variant="body1" paragraph>
              The technology field evolves rapidly, requiring professionals to continuously update their skills and knowledge. To advance your career effectively:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" variant="body1" paragraph>
                <strong>Stay current with industry trends:</strong> Follow tech blogs, participate in webinars, and join professional communities to keep up with emerging technologies and methodologies.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Build a professional network:</strong> Connect with peers, mentors, and industry leaders through platforms like LinkedIn and tech meetups.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Contribute to open-source projects:</strong> This demonstrates your skills to potential employers while allowing you to learn from experienced developers.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Pursue continuous learning:</strong> Take courses, earn certifications, and work on side projects to expand your skill set and demonstrate your passion for the field.
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 3 }}>
              By implementing these strategies, you can enhance your marketability and progress toward your career goals in the competitive tech industry.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;