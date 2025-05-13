import React, { useEffect, useState } from 'react';
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
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Add as AddIcon,
  BusinessCenter as BusinessCenterIcon
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import { useJobStore } from '../store/jobStore';
import { useAuthStore } from '../store/authStore';
import JobCard from '../components/job/JobCard';
import Spinner from '../components/common/Spinner';
import AdBanner from '../components/common/AdBanner';
import { alpha } from '@mui/material/styles';

interface Filters {
  jobType: string;
  location: string;
  // experience: string;
  workplace: string;
}

const JobsPage: React.FC = () => {
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
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    jobType: '',
    location: '',
    // experience: '',
    workplace: ''
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    fetchJobs();
    setInitialLoad(false);
  }, [fetchJobs]);

  // Mark data as ready when loading completes, regardless of result count
  useEffect(() => {
    if (!loading && initialLoad === false) {
      setDataReady(true);
    }
  }, [loading, initialLoad]);

  useEffect(() => {
    setSearchText(searchQuery);
  }, [searchQuery]);

  // Apply filters when jobs data or filters change
  useEffect(() => {
    let result = [...jobs];

    // Apply each active filter
    activeFilters.forEach(filterName => {
      const filterValue = filters[filterName as keyof Filters];
      if (filterValue) {
        result = result.filter(job => {
          switch(filterName) {
            case 'jobType':
              return job.employment_type === filterValue;
            case 'location':
              return job.location === filterValue;
            // case 'experience':
            //   return job.experience_level === filterValue;
            case 'workplace':
              return job.workplace === filterValue;
            default:
              return true;
          }
        });
      }
    });

    setFilteredJobs(result);
  }, [jobs, filters, activeFilters]);

  const handleSearch = () => {
    if (searchText && searchText.trim()) {
      // Reset data ready state when starting a new search
      setDataReady(false);
      fetchJobsWithSearch(searchText);
      
      // Reset filters when searching
      clearAllFilters();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClearSearch = () => {
    setSearchText('');
    // Reset data ready state when clearing search
    setDataReady(false);
    resetSearch();
    // Reset filters when clearing search
    clearAllFilters();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    // Reset data ready state when changing page
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
      // experience: '',
      workplace: ''
    });
    setActiveFilters([]);
  };

  const getFilterDisplayName = (key: string): string => {
    const map: Record<string, string> = {
      jobType: 'Job Type',
      location: 'Location',
      // experience: 'Experience',
      workplace: 'Workplace'
    };
    return map[key] || key;
  };

  const getFilterDisplayValue = (filterName: string): string =>
    filters[filterName as keyof Filters];

  const isAdmin = user?.role === 'admin';

  // Use filteredJobs instead of jobs directly
  const jobsToDisplay = activeFilters.length > 0 ? filteredJobs : jobs;
  // Only show "No jobs found" when loading is complete and data is ready
  const noJobsFound = !loading && dataReady && jobsToDisplay.length === 0;

  return (
    <>
      <Helmet>
        <title>Browse Jobs | Find Your Dream Career</title>
        <meta name="description" content="Browse through hundreds of job opportunities across various industries. Find your dream job today." />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={4}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
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
              sx={{ minWidth: { sm: 300 }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSearch}
              sx={{ height: 40,borderRadius: 2 }}
            >
              Search
            </Button>
          </Box>


        </Box>

        <AdBanner slotId="1234567890" format="auto" />

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
                    {key === 'location' && ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'].map((loc) => (
                      <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                    ))}
                    {/* {key === 'experience' && ['Entry Level', 'Mid Level', 'Senior Level', 'Manager', 'Director'].map((exp) => (
                      <MenuItem key={exp} value={exp}>{exp}</MenuItem>
                    ))} */}
                    {key === 'workplace' && ['Remote', 'Hybrid', 'On-site'].map((wp) => (
                      <MenuItem key={wp} value={wp}>{wp}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>
          )}

          {activeFilters.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {activeFilters.map((filter) => (
                <Chip
                  key={filter}
                  label={`${getFilterDisplayName(filter)}: ${getFilterDisplayValue(filter)}`}
                  onDelete={() => handleRemoveFilter(filter)}
                  color="primary"
                  variant="outlined"
                  size="small"
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
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.light', color: 'error.dark', borderLeft: 5, borderColor: 'error.main' }}>
            <Typography>Error loading jobs. Please try again later.</Typography>
          </Paper>
        )}

        {/* Loading Spinner - only show when actively loading */}
        {loading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Spinner size="large" />
          </Box>
        ) : dataReady && jobsToDisplay.length > 0 ? (
          /* Jobs Display - only show when data is ready and we have jobs */
          <>
            <Box display="flex" flexWrap="wrap" gap={3}>
              {jobsToDisplay.map((job) => (
                <Box key={job.job_id} sx={{ flex: '1 1 300px' }}>
                  <JobCard job={job} isAdmin={isAdmin} onDelete={isAdmin ? handleDeleteJob : undefined} />
                </Box>
              ))}
            </Box>

            {pagination.totalPages > 1 && !activeFilters.length && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        ) : dataReady && jobsToDisplay.length === 0 ? (
          /* No Jobs Found - only show when data is ready and we have no jobs */
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
              <Stack direction="row" spacing={2} justifyContent="center">
                {searchQuery && (
                  <Button variant="outlined" onClick={handleClearSearch} startIcon={<CloseIcon />}>
                    Clear search
                  </Button>
                )}
                {activeFilters.length > 0 && (
                  <Button variant="outlined" onClick={clearAllFilters} startIcon={<CloseIcon />}>
                    Clear filters
                  </Button>
                )}
              </Stack>
            )}
          </Paper>
        ) : (
          /* Show a spinner for any other state (should rarely happen) */
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Spinner size="large" />
          </Box>
        )}

        {/* Bottom Banner */}
        <Box mt={6} mb={2}>
          <AdBanner slotId="0987654321" format="leaderboard" />
        </Box>

        {/* SEO content */}
        <Paper sx={{ mt: 6, p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>Find Your Dream Job Today</Typography>
          <Typography paragraph>
            Browse through our extensive job listings spanning various industries and roles.Our platform makes it easy to search for jobs by location, skills, experience level,
            and employment type.
          </Typography>
          {/* <Typography paragraph>
             Create an account to save your favorite jobs, set up job alerts,
            and track your applications all in one place.
          </Typography> */}
          {/* <Typography>
            Are you an employer?{' '}
            <RouterLink to="/post-job">Post a job</RouterLink> today
            and reach thousands of qualified candidates.
          </Typography> */}
        </Paper>
      </Container>
    </>
  );
};

export default JobsPage;
