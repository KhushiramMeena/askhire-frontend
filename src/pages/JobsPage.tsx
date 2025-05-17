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
  useMediaQuery
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

const SEO_TITLE = "Browse Jobs | Find Your Dream Career";
const SEO_DESCRIPTION = "Browse through hundreds of job opportunities across various industries. Filter by job type, location, and workplace preference to find your perfect career match.";
const SEO_KEYWORDS = "job search, career opportunities, tech jobs, job listings";

interface Filters {
  jobType: string;
  location: string;
  workplace: string;
}

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
    resetSearch
  } = useJobStore();

  const { user } = useAuthStore();
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchText, setSearchText] = useState(searchQuery);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    jobType: '',
    location: '',
    workplace: ''
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dataReady, setDataReady] = useState(false);

  // Memoize filtered jobs to improve performance
  const filteredJobs = useMemo(() => {
    if (activeFilters.length === 0) return jobs;
    
    return jobs.filter(job => {
      return activeFilters.every(filterName => {
        const filterValue = filters[filterName as keyof Filters];
        if (!filterValue) return true;
        
        switch (filterName) {
          case 'jobType':
            return job.employment_type === filterValue;
          case 'location':
            return job.location.startsWith(filterValue);
          case 'workplace':
            return job.workplace === filterValue;
          default:
            return true;
        }
      });
    });
  }, [jobs, filters, activeFilters]);

  // Initial data fetch
  useEffect(() => {
    fetchJobs();
    setInitialLoad(false);
  }, [fetchJobs]);

  // Mark data as ready when loading completes
  useEffect(() => {
    if (!loading && initialLoad === false) {
      setDataReady(true);
    }
  }, [loading, initialLoad]);

  // Update search text when global search query changes
  useEffect(() => {
    setSearchText(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchText && searchText.trim()) {
      setDataReady(false);
      fetchJobsWithSearch(searchText);
      clearAllFilters();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClearSearch = () => {
    setSearchText('');
    setDataReady(false);
    resetSearch();
    clearAllFilters();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setDataReady(false);
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
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));

    if (value) {
      if (!activeFilters.includes(name)) {
        setActiveFilters([...activeFilters, name]);
      }
    } else {
      setActiveFilters(activeFilters.filter((filter) => filter !== name));
    }
  };

  const handleRemoveFilter = (filterName: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: ''
    }));
    setActiveFilters(activeFilters.filter((filter) => filter !== filterName));
  };

  const clearAllFilters = () => {
    setFilters({
      jobType: '',
      location: '',
      workplace: ''
    });
    setActiveFilters([]);
  };

  const getFilterDisplayName = (key: string): string => {
    const map: Record<string, string> = {
      jobType: 'Job Type',
      location: 'Location',
      workplace: 'Workplace'
    };
    return map[key] || key;
  };

  const getFilterDisplayValue = (filterName: string): string =>
    filters[filterName as keyof Filters];

  const isAdmin = user?.role === 'admin';
  const jobsToDisplay = activeFilters.length > 0 ? filteredJobs : jobs;
  const noJobsFound = !loading && dataReady && jobsToDisplay.length === 0;
  
  // Locations for structured data
  const jobLocations = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'];
  
  return (
    <>
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <meta name="keywords" content={SEO_KEYWORDS} />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={SEO_TITLE} />
        <meta name="twitter:description" content={SEO_DESCRIPTION} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Structured data for job listings (JobPosting schema) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": jobsToDisplay.slice(0, 10).map((job, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "JobPosting",
                "title": job.job_title,
                "description": job.description,
                "datePosted": job.post_date,
                "employmentType": job.employment_type,
                "hiringOrganization": {
                  "@type": "Organization",
                  "name": job.company_name
                },
                "jobLocation": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": job.location
                  }
                }
              }
            }))
          })}
        </script>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        {/* Header */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={4}>
          <Typography 
            variant="h4" 
            fontWeight={600} 
            gutterBottom
            sx={{ mb: { xs: 2, md: 0 } }}
          >
            Browse Jobs
          </Typography>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1}>
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
                    <IconButton size="small" onClick={handleClearSearch}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ 
                minWidth: { sm: 300 }, 
                '& .MuiOutlinedInput-root': { borderRadius: 2 } 
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{ 
                height: 40, 
                borderRadius: 2,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Search
            </Button>
          </Box>
        </Box>

        <AdBanner slotId="1234567890" format="auto" responsive={true} />

        {/* Filters */}
        <Paper sx={{ p: 1, mb: 3, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center">
              <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={600}>Filters</Typography>
              {activeFilters.length > 0 && (
                <Chip
                  label={`${activeFilters.length} active`}
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <Button size="small" onClick={() => setFiltersVisible(!filtersVisible)}>
              {filtersVisible ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </Box>

          {filtersVisible && (
            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
              {Object.entries(filters).map(([key, val]) => (
                <FormControl key={key} fullWidth sx={{ flex: '1 1 200px' }} size="small">
                  <InputLabel>{getFilterDisplayName(key)}</InputLabel>
                  <Select
                    label={getFilterDisplayName(key)}
                    name={key}
                    value={val}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    {key === 'jobType' && ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                    {key === 'location' && jobLocations.map((loc) => (
                      <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                    ))}
                    {key === 'workplace' && ['Remote', 'Hybrid', 'Onsite'].map((wp) => (
                      <MenuItem key={wp} value={wp}>{wp}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>
          )}

          {activeFilters.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {activeFilters.map((filter) => (
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
                label="Clear All"
                onClick={clearAllFilters}
                color="secondary"
                size="small"
              />
            </Stack>
          )}
        </Paper>

        {/* Filter Results Info */}
        {activeFilters.length > 0 && (
          <Box mb={3}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} with selected filters
              {searchQuery && ' and search criteria'}
            </Typography>
          </Box>
        )}

        {/* Search Result Info */}
        {searchQuery && !activeFilters.length && (
          <Box mb={3}>
            <Typography variant="body1">
              Showing results for <strong>"{searchQuery}"</strong>
            </Typography>
            <Button startIcon={<CloseIcon />} onClick={handleClearSearch} size="small">
              Clear search
            </Button>
          </Box>
        )}

        {/* Error */}
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

        {loading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Spinner size="large" />
          </Box>
        ) : dataReady && jobsToDisplay.length > 0 ? (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(auto-fill, minmax(280px, 1fr))',
                  md: 'repeat(auto-fill, minmax(320px, 1fr))'
                },
                gap: 3,
                width: '100%'
              }}
              role="list"
              aria-label="Job listings"
            >
              {jobsToDisplay.map((job) => (
                <Box 
                  key={job.job_id}
                  role="listitem"
                  sx={{
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

            {pagination.totalPages > 1 && !activeFilters.length && (
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
        ) : dataReady && noJobsFound ? (
          <Paper sx={{ p: 6, textAlign: 'center', border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Box mb={3}>
              <BusinessCenterIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" gutterBottom>No jobs found</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {searchQuery || activeFilters.length > 0
                ? "No jobs match your current search criteria or filters."
                : "There are no job listings available at the moment."}
            </Typography>
            {(searchQuery || activeFilters.length > 0) && (
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
                {activeFilters.length > 0 && (
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
        <Box mt={6} mb={2}>
          <AdBanner slotId="0987654321" format="leaderboard" responsive={true} />
        </Box>

        {/* SEO content */}
        <Paper sx={{ mt: 6, p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>Find Your Dream Job Today</Typography>
          <Typography paragraph>
            Browse through our extensive job listings spanning various industries and roles. Our platform makes it easy to search for jobs by location, skills, experience level,
            and employment type.
          </Typography>
          <Typography paragraph>
            Whether you're looking for opportunities in Bengaluru, Mumbai, Delhi, or other major cities across India, we have listings covering all major industry sectors including technology, 
            healthcare, finance, marketing, and more.
          </Typography>
          <Typography>
            Start your job search today and discover the perfect career opportunity matching your skills and preferences.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default JobsPage;
