// src/pages/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useJobStore } from '../store/jobStore';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/common/AdBanner';

// MUI imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

interface ProfileUpdateData {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * ProfilePage component for user account management
 * Allows users to view their profile, edit account details,
 * and see their job posting/application activity
 */
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profileData, loadProfileData, updateProfile, isLoading, error, clearError,logout } = useAuthStore();
  const { jobs, fetchJobs } = useJobStore();
  
  const [formData, setFormData] = useState<ProfileUpdateData>({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProfileUpdateData, string>>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  
  // Load profile data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadProfileData();
        clearError();
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
    
    loadData();
  }, [loadProfileData, clearError]);
  
  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username
      }));
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name as keyof ProfileUpdateData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Clear success message when editing
    if (updateSuccess) {
      setUpdateSuccess(false);
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProfileUpdateData, string>> = {};
    let isValid = true;
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }
    
    // Password validation - only if attempting to change password
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required';
        isValid = false;
      }
      
      if (formData.newPassword.length < 6) {
        errors.newPassword = 'New password must be at least 6 characters long';
        isValid = false;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const updateData: { username?: string; password?: string } = {};
      
      // Only include fields that have changed
      if (formData.username !== user?.username) {
        updateData.username = formData.username;
      }
      
      if (formData.newPassword && formData.currentPassword) {
        updateData.password = formData.newPassword;
      }
      
      await updateProfile(updateData);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setUpdateSuccess(true);
      setIsEditing(false);
      logout()
    } catch (error) {
      console.error('Profile update failed');
    }
  };
  
  const handleDeleteJob = (jobId: number) => {
    // This would redirect to job management page in a real application
    navigate(`/jobs/manage/${jobId}`);
  };
  
  const handleViewApplications = (jobId: number) => {
    // This would redirect to applications view in a real application
    navigate(`/jobs/applications/${jobId}`);
  };
  
  if (isLoading && !profileData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Your Profile | Askhire</title>
        <meta name="description" content="Manage your Askhire profile and account settings." />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 6 }}>
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary" mb={3}>
            Your Profile
          </Typography>
          
          {/* AdSense Banner */}
          <Box mb={4}>
            <AdBanner slotId="1234567890" format="leaderboard" />
          </Box>
          
          <Box sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
            overflow: 'hidden'
          }}>
            <Box sx={{ p: 4 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {updateSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Profile updated successfully!
                </Alert>
              )}
              
              <Box mb={4}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    Account Information
                  </Typography>
                  <Button
                    startIcon={isEditing ? <CloseIcon /> : <EditIcon />}
                    onClick={() => setIsEditing(!isEditing)}
                    color="primary"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Box>
                
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                        <Box sx={{ width: '100%' }}>
                          <TextField
                            label="Username"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.username}
                            helperText={formErrors.username}
                            size="small"
                          />
                        </Box>
                        
                        {/* <Box sx={{ width: '100%' }}>
                          <TextField
                            label="Role"
                            id="role"
                            value={user?.role || ''}
                            fullWidth
                            disabled
                            size="small"
                            helperText="Role cannot be changed"
                          />
                        </Box> */}
                      </Box>
                      
                      <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2 }}>
                        Change Password
                      </Typography>
                      
                      <TextField
                        label="Current Password"
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!formErrors.currentPassword}
                        helperText={formErrors.currentPassword}
                        size="small"
                      />
                      
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                        <TextField
                          label="New Password"
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          fullWidth
                          error={!!formErrors.newPassword}
                          helperText={formErrors.newPassword}
                          size="small"
                        />
                        
                        <TextField
                          label="Confirm New Password"
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          fullWidth
                          error={!!formErrors.confirmPassword}
                          helperText={formErrors.confirmPassword}
                          size="small"
                        />
                      </Box>
                    </Box>
                    
                    <Box mt={3}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Box>
                  </form>
                ) : (
                  <Box sx={{ bgcolor: '#f8f9fa', borderRadius: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      <Box sx={{ width: '50%', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Username
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          {user?.username}
                        </Typography>
                      </Box>
                      {/* <Box sx={{ width: '50%', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Role
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          {user?.role}
                        </Typography>
                      </Box> */}
                      {/* <Box sx={{ width: '50%', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Account Created
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                       
                        </Typography>
                      </Box> */}
                      {/* <Box sx={{ width: '50%', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Email Verified
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                        </Typography>
                      </Box> */}
                    </Box>
                  </Box>
                )}
              </Box>
              
              {/* Activity Stats */}
              {user?.role === "admin" && (
  <>
    <Box mb={4}>
      <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>
        Activity Summary
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
        <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 1, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="medium">
            Posted Jobs
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            {myJobs.length || 0}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: 1, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="medium">
            Applications
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="success.main">
            0
          </Typography>
        </Box>
        <Box sx={{ bgcolor: '#f3e5f5', p: 2, borderRadius: 1, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="medium">
            Reputation
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="secondary.main">
            {user?.reputation || 0}
          </Typography>
        </Box>
      </Box>
    </Box>

    <Box mb={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Your Job Postings
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => navigate('/post-job')}
          color="primary"
        >
          Post New Job
        </Button>
      </Box>

      {jobsLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="120px">
          <CircularProgress />
        </Box>
      ) : myJobs.length > 0 ? (
        <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Posted On</TableCell>
                <TableCell>Applications</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myJobs.map((job) => (
                <TableRow key={job.job_id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {job.job_title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.company_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(job.post_date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {job.applications || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleViewApplications(job.job_id)}
                      >
                        View Applications
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteJob(job.job_id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            bgcolor: '#f8f9fa',
            p: 3,
            borderRadius: 1,
            textAlign: 'center'
          }}
        >
          <Typography color="text.secondary" mb={2}>
            You haven't posted any jobs yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/post-job')}
          >
            Post Your First Job
          </Button>
        </Box>
      )}
    </Box>
  </>
)}

              
              {/* Recent Applications */}
              {/* <Box>
                <Typography variant="h6" fontWeight="bold" color="text.primary" mb={2}>
                  Your Recent Applications
                </Typography>
                
                <Box 
                  sx={{ 
                    bgcolor: '#f8f9fa', 
                    p: 3, 
                    borderRadius: 1, 
                    textAlign: 'center' 
                  }}
                >
                  <Typography color="text.secondary" mb={2}>
                    You haven't applied to any jobs yet.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/jobs')}
                  >
                    Browse Jobs
                  </Button>
                </Box>
              </Box> */}
            </Box>
          </Box>
          
          {/* AdSense Banner */}
          <Box mt={4}>
            <AdBanner slotId="0987654321" format="leaderboard" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;