import React, { useEffect, useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Pagination,
  Paper,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
  IconButton,
  useMediaQuery,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  BusinessCenter as BusinessCenterIcon
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { useJobStore } from '../store/jobStore';
import { useAuthStore } from '../store/authStore';
import JobCard from '../components/job/JobCard';
import Spinner from '../components/common/Spinner';
import AdBanner from '../components/common/AdBanner';
import { useTheme } from '@mui/material/styles';

type FilterKey = 'jobType' | 'location' | 'workplace';

const JobsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    jobs,
    loading,
    error,
    fetchJobs,
    deleteJob,
    pagination,
    setPage,
    fetchJobsWithSearch,
    searchQuery,
    resetSearch,
    activeFilters,
    applyFilter,
    removeFilter,
    clearAllFilters
  } = useJobStore();

  const { user } = useAuthStore();
  const [searchText, setSearchText] = useState(searchQuery);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  // Enhanced SEO meta tags with dynamic content
  const seoMetaTags = useMemo(() => {
    const totalJobs = pagination.totalItems || 0;
    const currentLocation = activeFilters.location || '';
    const currentJobType = activeFilters.jobType || '';
    
    let title = "Browse Jobs | Find Software Engineer & Tech Careers - AskHire";
    let description = `Browse ${totalJobs}+ job opportunities including software engineer positions. Find jobs in ${currentLocation || 'India'} with top companies. Filter by skills, location, and job type.`;
    
    if (searchQuery) {
      title = `${searchQuery} Jobs | Software Engineer Careers - AskHire`;
      description = `Find ${searchQuery} jobs including software engineer roles. Browse verified job listings and career opportunities in India.`;
    }
    
    if (currentLocation && currentJobType) {
      title = `${currentJobType} Jobs in ${currentLocation} | Software Engineer - AskHire`;
      description = `Find ${currentJobType} jobs in ${currentLocation} including software engineer positions. Browse verified career opportunities with top companies.`;
    }
    
    const keywords = [
      'jobs', 'software engineer', 'browse jobs', 'career opportunities', 
      'job search', 'skills', 'employment', 'tech jobs', 'india jobs',
      searchQuery, currentLocation, currentJobType
    ].filter(Boolean).join(', ');
    
    return { title, description, keywords };
  }, [searchQuery, activeFilters, pagination.totalItems]);

  const activeFilterNames = useMemo(() =>
    Object.entries(activeFilters)
      .filter(([_, value]) => Boolean(value))
      .map(([key]) => key as FilterKey),
    [activeFilters]
  );

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setSearchText(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (!loading) {
      setDataReady(true);
    } else {
      setDataReady(false);
    }
  }, [loading]);

  const handleSearch = () => {
    if (searchText && searchText.trim()) {
      fetchJobsWithSearch(searchText);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClearSearch = () => {
    setSearchText('');
    resetSearch();
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      await deleteJob(jobId);
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    applyFilter(name as FilterKey, value);
  };

  const handleRemoveFilter = (filterName: FilterKey) => {
    removeFilter(filterName);
  };

  const getFilterDisplayName = (key: string): string => {
    const map: Record<string, string> = {
      jobType: 'Job Type',
      location: 'Location',
      workplace: 'Workplace'
    };
    return map[key] || key;
  };

  const getFilterDisplayValue = (filterName: FilterKey): string =>
    activeFilters[filterName] || '';

  const jobLocations = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
  const isAdmin = user?.role === 'admin';
  const noJobsFound = !loading && dataReady && jobs.length === 0;

  const menuProps = {
    PaperProps: {
      style: { maxHeight: 300 },
    },
    disableScrollLock: true,
    disableAutoFocusItem: true,
    anchorOrigin: {
      vertical: 'bottom' as const,
      horizontal: 'left' as const,
    },
    transformOrigin: {
      vertical: 'top' as const,
      horizontal: 'left' as const,
    },
  };

  return (
    <>
      <Helmet>
        <title>{seoMetaTags.title}</title>
        <meta name="description" content={seoMetaTags.description} />
        <meta name="keywords" content={seoMetaTags.keywords} />
        
        {/* Enhanced Open Graph tags */}
        <meta property="og:title" content={seoMetaTags.title} />
        <meta property="og:description" content={seoMetaTags.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://askhire.in/jobs" />
        <meta property="og:image" content="https://askhire.in/logo512.png" />
        <meta property="og:site_name" content="AskHire" />
        
        {/* Enhanced Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMetaTags.title} />
        <meta name="twitter:description" content={seoMetaTags.description} />
        <meta name="twitter:image" content="https://askhire.in/logo512.png" />
        <meta name="twitter:site" content="@AskHire" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://askhire.in/jobs" />
        
        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="author" content="AskHire" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />

        {/* Enhanced structured data for job listings */}
        {jobs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Job Listings",
              "description": "Browse software engineer and tech job opportunities",
              "numberOfItems": jobs.length,
              "itemListElement": jobs.slice(0, 10).map((job, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "JobPosting",
                  "title": job.job_title,
                  "description": job.description,
                  "datePosted": job.post_date,
                  "employmentType": job.employment_type,
                  "industry": "Technology",
                  "hiringOrganization": {
                    "@type": "Organization",
                    "name": job.company_name,
                    "logo": job.company_logo
                  },
                  "jobLocation": {
                    "@type": "Place",
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": job.location,
                      "addressCountry": "IN"
                    }
                  },
                  "baseSalary": job.expectedSalary ? {
                    "@type": "MonetaryAmount",
                    "currency": "INR",
                    "value": {
                      "@type": "QuantitativeValue",
                      "value": job.expectedSalary
                    }
                  } : undefined,
                  "skills": job.skills
                }
              }))
            })}
          </script>
        )}
        
        {/* Breadcrumb structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://askhire.in"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Jobs",
                "item": "https://askhire.in/jobs"
              }
            ]
          })}
        </script>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        {/* Header Section with proper H1 */}
        <Box 
          component="header"
          sx={{
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' }, 
            mb: 4,
            gap: { xs: 2, md: 0 }
          }}
        >
          {/* CRITICAL FIX: Proper H1 heading with keywords */}
          <Box>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
                color: '#111827',
                lineHeight: 1.2
              }}
            >
              Browse Jobs
            </Typography>
            <Typography
              component="p"
              variant="body1"
              color="text.secondary"
              sx={{ mb: { xs: 2, md: 0 } }}
            >
              Find software engineer jobs and career opportunities with top companies
            </Typography>
          </Box>
          
          {/* Enhanced search section */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 1,
              minWidth: { sm: 350, md: 400 }
            }}
          >
            <TextField
              placeholder="Search jobs, companies, skills..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleInputKeyDown}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch} aria-label="Clear search">
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              aria-label="Search for jobs and software engineer positions"
              sx={{
                height: 40,
                borderRadius: 2,
                width: { xs: '100%', sm: 'auto' },
                minWidth: { sm: 100 }
              }}
            >
              Search
            </Button>
          </Box>
        </Box>

        {/* AdSense Banner */}
        {/* <Box sx={{ mb: 3 }}>
          <AdBanner slotId="1234567890" format="auto" responsive={true} />
        </Box> */}

        {/* Enhanced Filters Section */}
        <Box 
          component="section"
          sx={{ p: 1, mb: 3, borderRadius: 1 }}
          aria-label="Job filters"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center">
              <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography 
                component="h2"
                variant="subtitle1" 
                fontWeight={600}
              >
                Filter Jobs
              </Typography>
              {activeFilterNames.length > 0 && (
                <Chip
                  label={`${activeFilterNames.length} active`}
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <Button 
              size="small" 
              onClick={() => setFiltersVisible(!filtersVisible)}
              aria-label={filtersVisible ? 'Hide job filters' : 'Show job filters'}
            >
              {filtersVisible ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Box>

          {filtersVisible && (
            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
              <FormControl fullWidth sx={{ flex: '1 1 200px' }} size="small">
                <InputLabel>Job Type</InputLabel>
                <Select
                  label="Job Type"
                  name="jobType"
                  value={activeFilters.jobType}
                  onChange={handleFilterChange}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">All Job Types</MenuItem>
                  {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ flex: '1 1 200px' }} size="small">
                <InputLabel>Location</InputLabel>
                <Select
                  label="Location"
                  name="location"
                  value={activeFilters.location}
                  onChange={handleFilterChange}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {jobLocations.map((loc) => (
                    <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ flex: '1 1 200px' }} size="small">
                <InputLabel>Workplace</InputLabel>
                <Select
                  label="Workplace"
                  name="workplace"
                  value={activeFilters.workplace}
                  onChange={handleFilterChange}
                  MenuProps={menuProps}
                >
                  <MenuItem value="">All Workplaces</MenuItem>
                  {['Remote', 'Hybrid', 'Onsite'].map((wp) => (
                    <MenuItem key={wp} value={wp}>{wp}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Active filters display */}
          {activeFilterNames.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {activeFilterNames.map((filter) => (
                <Chip
                  key={filter}
                  label={`${getFilterDisplayName(filter)}: ${getFilterDisplayValue(filter)}`}
                  onDelete={() => handleRemoveFilter(filter)}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                />
              ))}
              <Chip
                label="Clear All Filters"
                onClick={clearAllFilters}
                color="secondary"
                size="small"
                sx={{ mb: 1 }}
              />
            </Stack>
          )}
          <Divider sx={{ borderColor: '#4a5568', opacity: 0.1, my: 0.5 }} />
        </Box>

        {/* Results information */}
        {(activeFilterNames.length > 0 || searchQuery) && (
          <Box mb={3}>
            <Typography variant="body1" color="text.secondary">
              {searchQuery && (
                <span>
                  Showing results for <strong>"{searchQuery}"</strong>
                  {activeFilterNames.length > 0 && ' with selected filters'}
                </span>
              )}
              {!searchQuery && activeFilterNames.length > 0 && (
                <span>Showing {pagination.totalItems} filtered results</span>
              )}
            </Typography>
            {searchQuery && (
              <Button 
                startIcon={<CloseIcon />} 
                onClick={handleClearSearch} 
                size="small"
                sx={{ mt: 1 }}
              >
                Clear search
              </Button>
            )}
          </Box>
        )}

        {/* Error handling */}
        {error && (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              bgcolor: 'error.light',
              color: 'error.dark',
              borderLeft: 5,
              borderColor: 'error.main'
            }}
            role="alert"
          >
            <Typography>Error loading jobs. Please try again later.</Typography>
          </Paper>
        )}

        {/* Main content */}
        {loading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Spinner size="large" />
          </Box>
        ) : dataReady && jobs.length > 0 ? (
          <>
            {/* Jobs grid */}
            <Box
              component="main"
              sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr', // Single column on mobile
                    sm: 'repeat(auto-fit, minmax(320px, 1fr))', // Auto-fit for tablets and up
                    md: 'repeat(auto-fit, minmax(350px, 1fr))', // Slightly larger min-width for desktop
                  },
                  gap: '10px', // Consistent 10px gap on all screen sizes
                  justifyContent: 'center', // Center the entire grid
                  justifyItems: 'center', // Center individual grid items
                  maxWidth: {
                    xs: '100%',
                    sm: 'calc(2 * 350px + 10px)', // Max width for 2 columns + gap
                    lg: 'calc(3 * 350px + 20px)', // Max width for 3 columns + gaps
                    xl: 'calc(4 * 350px + 30px)', // Max width for 4 columns + gaps
                  },
                  mx: 'auto', // Center the grid container
                  mb: 4,
                }}
              role="list"
              aria-label="Software engineer and other job listings"
            >
              {jobs.map((job) => (
                <Box
                  key={job.job_id}
                  role="listitem"
                  sx={{
                    width: '100%',
                    maxWidth: '345px', // Match JobCard maxWidth
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <JobCard
                    job={job}
                    isAdmin={isAdmin}
                    onDelete={isAdmin ? handleDeleteJob : undefined}
                  />
                </Box>
              ))}
            </Box>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box
                display="flex"
                justifyContent="center"
                mt={4}
                component="nav"
                aria-label="Job listings pagination"
              >
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        ) : noJobsFound ? (
          <Paper sx={{ p: 6, textAlign: 'center', border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Box mb={3}>
              <BusinessCenterIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
            </Box>
            <Typography component="h3" variant="h6" gutterBottom>No Jobs Found</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {searchQuery || activeFilterNames.length > 0
                ? "No jobs match your current search criteria or filters."
                : "There are no job listings available at the moment."}
            </Typography>
            {(searchQuery || activeFilterNames.length > 0) && (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
              >
                {searchQuery && (
                  <Button
                    variant="outlined"
                    onClick={handleClearSearch}
                    startIcon={<CloseIcon />}
                    fullWidth={isMobile}
                  >
                    Clear search
                  </Button>
                )}
                {activeFilterNames.length > 0 && (
                  <Button
                    variant="outlined"
                    onClick={clearAllFilters}
                    startIcon={<CloseIcon />}
                    fullWidth={isMobile}
                  >
                    Clear filters
                  </Button>
                )}
              </Stack>
            )}
          </Paper>
        ) : (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Spinner size="large" />
          </Box>
        )}

        {/* Bottom Banner */}
        {/* <Box mt={6} mb={2}>
          <AdBanner slotId="0987654321" format="leaderboard" responsive={true} />
        </Box> */}

        {/* Enhanced SEO content section */}
        <Paper 
          component="section"
          sx={{ mt: 6, p: { xs: 3, sm: 4 }, border: 1, borderColor: 'divider', borderRadius: 2 }}
          aria-labelledby="seo-heading"
        >
          <Typography 
            id="seo-heading"
            component="h2"
            variant="h5" 
            gutterBottom 
            fontWeight={600}
          >
            Find Software Engineer Jobs and Career Opportunities
          </Typography>
          <Typography paragraph>
            Browse through our extensive collection of job listings spanning various industries and roles. 
            Our platform makes it easy to search for software engineer jobs, tech positions, and other career 
            opportunities by location, skills, experience level, and employment type.
          </Typography>
          <Typography paragraph>
            Whether you're looking for software engineer opportunities in Bengaluru, Mumbai, Delhi, or other 
            major cities across India, we have listings covering all major industry sectors including technology, 
            healthcare, finance, marketing, and more. Filter jobs by workplace preference - remote, hybrid, or onsite.
          </Typography>
          <Typography>
            Start your job search today and discover the perfect career opportunity matching your skills 
            and preferences. Join thousands of professionals who found their dream jobs through AskHire.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default JobsPage;