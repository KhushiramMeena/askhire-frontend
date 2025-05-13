import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useJobStore } from '../store/jobStore';
import JobCard from '../components/job/JobCard';
import Spinner from '../components/common/Spinner';
import AdBanner from '../components/common/AdBanner';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Typography, Container, Grid } from '@mui/material';

const HomePage: React.FC = () => {
  const { jobs, loading, error, fetchJobs } = useJobStore();
  const [featuredJobs, setFeaturedJobs] = useState<typeof jobs>([]);

  useEffect(() => {
    fetchJobs(1, 3);
  }, [fetchJobs]);

  useEffect(() => {
    if (jobs.length > 0) {
      setFeaturedJobs(jobs);
    }
  }, [jobs]);

  return (
    <>
      <Helmet>
        <title>Askhire - Find Your Dream Job Today</title>
        <meta 
          name="description" 
          content="Find your dream job or post job opportunities on our platform. Connect with the best talent and employers."
        />
        <meta name="keywords" content="AskHire, jobs, career, employment, recruitment, hiring, job search" />
        <meta property="og:title" content="Askhire - Find Your Dream Job Today" />
        <meta property="og:description" content="Find your dream job or post job opportunities on our platform. Connect with the best talent and employers." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <Box sx={{ background: 'linear-gradient(to right, #1E3A8A, #4F46E5)', color: 'white', py: 8 }}>
        <Container>
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 4 }}>
              Find Your Dream Job Today
            </Typography>
            <Typography variant="h6" sx={{ mb: 6, color: '#93C5FD' }}>
              Discover opportunities that match your skills and career goals.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                component={Link}
                to="/jobs"
                variant="contained"
                sx={{ backgroundColor: 'white', color: '#2563EB', '&:hover': { backgroundColor: '#EFF6FF' } }}
              >
                Browse Jobs
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured Jobs Section */}
      <Box sx={{ py: 6, backgroundColor: '#F3F4F6' }}>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Featured Jobs
            </Typography>
            <Button 
              component={Link}
              to="/jobs"
              variant="text"
              sx={{ color: '#2563EB' }}
            >
              View All Jobs
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <Spinner />
            </Box>
          ) : error ? (
            <Box sx={{ backgroundColor: '#FEE2E2', borderLeft: 4, borderColor: '#EF4444', padding: 2, borderRadius: 1 }}>
              <Typography sx={{ color: '#B91C1C' }}>Error loading jobs. Please try again later.</Typography>
            </Box>
          ) : featuredJobs.length > 0 ? (
            <Grid container spacing={4}>
              {featuredJobs.map((job: any) => (
                <Grid >
                  <JobCard job={job} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ backgroundColor: 'white', boxShadow: 1, padding: 4, textAlign: 'center' }}>
              <Typography>No featured jobs available at the moment.</Typography>
            </Box>
          )}

          {/* AdSense Banner */}
          <Box sx={{ mt: 6 }}>
            <AdBanner slotId ="1234567890" format="leaderboard" />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
