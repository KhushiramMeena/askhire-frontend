import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Avatar, 
  Stack, 
  Divider, 
  Button, 
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  AccessTime as TimeIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Job } from '../../types/job';
import { getSalaryRange, getDaysAgo } from '../../utils/formatters';
import { getUserCountry } from '../../utils/LocationUtils';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

interface JobCardProps {
  job: Job;
  isAdmin?: boolean;
  onDelete?: (jobId: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isAdmin = false, onDelete }) => {
  const theme = useTheme();
  const country = getUserCountry();
  const navigate = useNavigate();
  const skills = job.skills.split(',').map(skill => skill.trim());
  
  const jobUrlSlug = `${job.job_title.toLowerCase().replace(/\s+/g, '-')}-at-${job.company_name.toLowerCase().replace(/\s+/g, '-')}`;
  
  // Get workplace type styling
  const getWorkplaceTypeColor = () => {
    switch (job.workplace) {
      case 'Remote':
        return { color: theme.palette.warning.dark, bgColor: `${theme.palette.warning.main}15` };
      case 'Hybrid':
        return { color: theme.palette.info.dark, bgColor: `${theme.palette.info.main}15`  };
      case 'Onsite':
        return { color:  theme.palette.success.dark, bgColor: `${theme.palette.success.main}15` };
        
      default:
        return { color: theme.palette.grey[700], bgColor: theme.palette.grey[200] };
    }
  };
  
  const workplaceStyle = job.workplace ? getWorkplaceTypeColor() : { color: theme.palette.grey[700], bgColor: theme.palette.grey[200] };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      if (window.confirm('Are you sure you want to delete this job listing?')) {
        onDelete(job.job_id);
      }
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use navigate to go to the job detail page with the proper slug
    navigate(`/job/${job.job_id}/${jobUrlSlug}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        display: 'block',
        textDecoration: 'none',
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
      elevation={1}
    >
      <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Card Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {job.company_logo ? (
              <Avatar 
                src={job.company_logo} 
                alt={`${job.company_name} logo`}
                sx={{ 
                  width: 48, 
                  height: 48,
                  mr: 2,
                  bgcolor: 'primary.light'
                }}
              />
            ) : (
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48,
                  mr: 2,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText'
                }}
              >
                {job.company_name.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <Box>
              <Typography variant="subtitle1" component="h3" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
                {job.job_title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {job.company_name}
              </Typography>
            </Box>
          </Box>
          
          {job.workplace && (
            <Chip 
              label={job.workplace}
              size="small"
              sx={{
                bgcolor: workplaceStyle.bgColor,
                color: workplaceStyle.color,
                fontWeight: 500,
                height: 24
              }}
            />
          )}
        </Box>

        {/* Job Details */}
        <Stack spacing={1} sx={{ mt: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {job.location}
            </Typography>
          </Box>
          
          {job.expectedSalary && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
{(!country || country === "India") ? (
  <CurrencyRupeeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
) : (
  <SalaryIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
)}

              <Typography variant="body2" color="text.secondary">
                {getSalaryRange(job.expectedSalary)}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {getDaysAgo(job.post_date)}
            </Typography>
          </Box>
        </Stack>
        
        <Divider sx={{ my: 1.5 }} />
        
        {/* Skills Section */}
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Required Skills:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {skills.slice(0, 3).map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                sx={{ 
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  fontWeight: 500,
                  height: 24
                }}
              />
            ))}
            {skills.length > 3 && (
              <Chip
                label={`+${skills.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ 
                  height: 24
                }}
              />
            )}
          </Box>
        </Box>
        
        {/* Admin Actions */}
        {isAdmin && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Tooltip title="Delete job">
              <IconButton
                size="small"
                onClick={handleDelete}
                color="error"
                sx={{ ml: 'auto' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;