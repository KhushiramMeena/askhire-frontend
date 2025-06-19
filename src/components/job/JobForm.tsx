

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobStore } from '../../store/jobStore';
import { useAuthStore } from '../../store/authStore';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../common/AdBanner';


// MUI imports
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Paper,
  CircularProgress,
  Stack,
  Snackbar
} from '@mui/material';

interface FormData {
  job_title: string;
  company_name: string;
  company_logo: string;
  description: string;
  expectedSalary: string;
  eligibleBatch: string;
  location: string;
  skills: string;
  employment_type: string;
  apply_link: string;
  workplace: string;
}

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Internship',
  'Volunteer',
  'Freelance'
];

const WORKPLACE_TYPES = ['Remote', 'Hybrid', 'Onsite'];

const JobForm: React.FC = () => {
  const navigate = useNavigate();
  const { postJob, loading, error: jobError } = useJobStore();
  const { token, isAuthenticated } = useAuthStore();
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    job_title: '',
    company_name: '',
    company_logo: '',
    description: '',
    expectedSalary: '',
    eligibleBatch: '',
    location: '',
    skills: '',
    employment_type: '',
    apply_link: '',
    workplace: ''
  });

  // Check authentication on mount and before submission
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        // Save form data to session storage before redirecting
        sessionStorage.setItem('jobFormData', JSON.stringify(formData));
        navigate('/login', { state: { from: '/post-job' } });
      }
    };
    
    checkAuth();
  }, [isAuthenticated, navigate, formData]);
  
  // Restore form data if returning from login
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('jobFormData');
    if (savedFormData && isAuthenticated) {
      try {
        setFormData(JSON.parse(savedFormData));
        // Clear saved data once restored
        sessionStorage.removeItem('jobFormData');
      } catch (e) {
        console.error('Error restoring form data:', e);
      }
    }
  }, [isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as keyof FormData;
    const value = e.target.value as string;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    // Required fields
    const requiredFields: (keyof FormData)[] = ['job_title', 'company_name', 'description', 'location', 'skills', 'apply_link'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        errors[field] = 'This field is required';
        isValid = false;
      }
    });

    // Validate URL fields
    if (formData.company_logo && !isValidUrl(formData.company_logo)) {
      errors.company_logo = 'Please enter a valid URL';
      isValid = false;
    }

    if (formData.apply_link && !isValidUrl(formData.apply_link)) {
      errors.apply_link = 'Please enter a valid URL';
      isValid = false;
    }

    // Validate salary
    if (formData.expectedSalary && !isValidSalary(formData.expectedSalary)) {
      errors.expectedSalary = 'Please enter a valid number';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidSalary = (salary: string): boolean => {
    return /^\d+$/.test(salary);
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitError(null);
  
  // Check authentication status
  if (!isAuthenticated) {
    setSnackbarMessage('You need to be logged in to post a job');
    setSnackbarOpen(true);
    sessionStorage.setItem('jobFormData', JSON.stringify(formData));
    navigate('/login', { state: { from: '/post-job' } });
    return;
  }
  
  if (validateForm()) {
    try {
      // Convert salary to number if present
      const jobData = {
        ...formData,
        expectedSalary: formData.expectedSalary ? parseInt(formData.expectedSalary, 10) : undefined
      };
      
      // Let the jobStore and authApi interceptor handle the token
      await postJob(jobData, '');
      
      // Navigate to jobs page after successful post
      navigate('/jobs');
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setSnackbarMessage('Your session has expired. Please log in again.');
        setSnackbarOpen(true);
        sessionStorage.setItem('jobFormData', JSON.stringify(formData));
        navigate('/login', { state: { from: '/post-job' } });
      } else {
        const message = error.response?.data?.detail || error.message || 'An error occurred while posting the job';
        setSubmitError(message);
      }
    }
  }
};
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Post a New Job | Askhire</title>
        <meta name="description" content="Post a new job opportunity and reach thousands of potential candidates." />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box maxWidth="md" mx="auto">
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
            Post a New Job
          </Typography>
          
          {/* Top AdSense Banner */}
          {/* <Box sx={{ mb: 3 }}>
            <AdBanner slotId="1234567890" format="leaderboard" />
          </Box> */}
          
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submitError}
            </Alert>
          )}
          
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    id="job_title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior React Developer"
                    error={!!formErrors.job_title}
                    helperText={formErrors.job_title}
                    required
                  />
                  
                  <TextField
                    fullWidth
                    label="Company Name"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Inc."
                    error={!!formErrors.company_name}
                    helperText={formErrors.company_name}
                    required
                  />
                </Stack>
                
                {/* Rest of the form fields remain unchanged */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Location"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Bengaluru, Karnataka"
                    error={!!formErrors.location}
                    helperText={formErrors.location}
                    required
                  />
                  
                  <FormControl fullWidth>
                    <InputLabel id="workplace-label">Workplace Type</InputLabel>
                    <Select
                      labelId="workplace-label"
                      id="workplace"
                      name="workplace"
                      value={formData.workplace}
                      onChange={e => handleSelectChange(e as any)}
                      label="Workplace Type"
                    >
                      <MenuItem value="">
                        <em>Select Workplace Type</em>
                      </MenuItem>
                      {WORKPLACE_TYPES.map(type => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="employment-type-label">Employment Type</InputLabel>
                    <Select
                      labelId="employment-type-label"
                      id="employment_type"
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={e => handleSelectChange(e as any)}
                      label="Employment Type"
                    >
                      <MenuItem value="">
                        <em>Select Employment Type</em>
                      </MenuItem>
                      {EMPLOYMENT_TYPES.map(type => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Expected Salary (INR per year)"
                    id="expectedSalary"
                    name="expectedSalary"
                    type="number"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="e.g. 1200000"
                    error={!!formErrors.expectedSalary}
                    helperText={formErrors.expectedSalary}
                  />
                </Stack>
                
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Eligible Batch"
                    id="eligibleBatch"
                    name="eligibleBatch"
                    value={formData.eligibleBatch}
                    onChange={handleInputChange}
                    placeholder="e.g. 2020-2024"
                  />
                  
                  <Box sx={{ width: '100%' }}></Box> {/* Spacer for alignment */}
                </Stack>
                
                <TextField
                  fullWidth
                  label="Skills Required"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g. React, TypeScript, NodeJS (comma separated)"
                  error={!!formErrors.skills}
                  helperText={formErrors.skills}
                  required
                />
                
                <TextField
                  fullWidth
                  label="Company Logo URL"
                  id="company_logo"
                  name="company_logo"
                  value={formData.company_logo}
                  onChange={handleInputChange}
                  placeholder="e.g. https://example.com/logo.png"
                  error={!!formErrors.company_logo}
                  helperText={formErrors.company_logo}
                />
                
                <TextField
                  fullWidth
                  label="Application URL"
                  id="apply_link"
                  name="apply_link"
                  value={formData.apply_link}
                  onChange={handleInputChange}
                  placeholder="e.g. https://example.com/careers/apply"
                  error={!!formErrors.apply_link}
                  helperText={formErrors.apply_link}
                  required
                />
                
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Job Description"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed job description, responsibilities, requirements, etc."
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  required
                />
                
                <Box sx={{ mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    size="large"
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        Posting Job...
                      </Box>
                    ) : (
                      'Post Job'
                    )}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Paper>
          
          {/* Bottom AdSense Banner */}
          {/* <Box sx={{ mt: 4 }}>
            <AdBanner slotId="0987654321" format="leaderboard" />
          </Box> */}
        </Box>
      </Container>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default JobForm;