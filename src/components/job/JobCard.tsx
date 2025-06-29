import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  useTheme,
  Skeleton
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
import '../../../src/css/components/JobCard.css';
import { OptimizedImage } from '../../utils/ImageOptimizer';

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
  
  // Enhanced URL slug generation with better SEO
  const jobUrlSlug = `${job.job_title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-at-${job.company_name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}`;
  
  // Get workplace type styling with better contrast
  const getWorkplaceTypeColor = useCallback(() => {
    switch (job.workplace) {
      case 'Remote':
        return { 
          color: theme.palette.warning.dark, 
          bgColor: `${theme.palette.warning.main}20`,
          borderColor: `${theme.palette.warning.main}40`
        };
      case 'Hybrid':
        return { 
          color: theme.palette.info.dark, 
          bgColor: `${theme.palette.info.main}20`,
          borderColor: `${theme.palette.info.main}40`
        };
      case 'Onsite':
        return { 
          color: theme.palette.success.dark, 
          bgColor: `${theme.palette.success.main}20`,
          borderColor: `${theme.palette.success.main}40`
        };
      default:
        return { 
          color: theme.palette.grey[700], 
          bgColor: theme.palette.grey[100],
          borderColor: theme.palette.grey[300]
        };
    }
  }, [job.workplace, theme]);
  
  const workplaceStyle = job.workplace ? getWorkplaceTypeColor() : getWorkplaceTypeColor();

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      if (window.confirm('Are you sure you want to delete this job listing?')) {
        onDelete(job.job_id);
      }
    }
  }, [onDelete, job.job_id]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Enhanced navigation with better URL structure
    navigate(`/job/${job.job_id}/${jobUrlSlug}`);
  }, [navigate, job.job_id, jobUrlSlug]);

  // Structured data for individual job card
  const jobStructuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.job_title,
    "description": job.description || `${job.job_title} position at ${job.company_name}`,
    "datePosted": job.post_date,
    "employmentType": job.employment_type || "FULL_TIME",
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
    "skills": job.skills,
    "url": `https://askhire.in/job/${job.job_id}/${jobUrlSlug}`
  };

  return (
    <>
      {/* Job structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobStructuredData) }}
      />
      
      <Box
        component="article"
        onClick={handleCardClick}
        className="job-card"
        role="article"
        aria-label={`${job.job_title} at ${job.company_name}`}
        tabIndex={0}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          transition: 'all 0.2s ease',
          backgroundColor: 'background.paper',
          '&:hover': {
            borderColor: 'primary.main',
            transform: 'translateY(-3px)',
          }
        }}
      >
        <Box className="job-card-content" sx={{ p: 2 }}>
          {/* Card Header - Fixed height */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            mb: 0.6,
            minHeight: 60, // Fixed header height
            maxHeight: 60
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
              {job.company_logo ? (
                <OptimizedImage
                  src={job.company_logo}
                  alt={`${job.company_name} company logo`}
                  width={48}
                  height={48}
                  borderRadius="50%"
                  fallbackChar={job.company_name.charAt(0).toUpperCase()}
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48,
                    mr: 2,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                >
                  {job.company_name.charAt(0).toUpperCase()}
                </Avatar>
              )}
              
              <Box sx={{ minWidth: 0, flex: 1, ml: 2 }}>
                {/* Job Title + Workplace inline */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', minWidth: 0, mb: 0.5 }}>
                  <Typography 
                    className="job-title"
                    variant="subtitle1" 
                    component="h3" 
          noWrap 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      flex: 1,
                      minWidth: 0,
                      mr: 1,
                      transition: 'color 0.2s ease',
                      lineHeight: 1.3,
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                    title={job.job_title}
                  >
                    {job.job_title}
                  </Typography>
                  {job.workplace && (
                    <Chip 
                      label={job.workplace}
                      size="small"
                      sx={{
                        bgcolor: workplaceStyle.bgColor,
                        color: workplaceStyle.color,
                        border: `1px solid ${workplaceStyle.borderColor}`,
                        fontWeight: 500,
                        height: 20,
                        flexShrink: 0,
                        fontSize: '0.7rem',
                        '& .MuiChip-label': {
                          px: 0.75
                        }
                      }}
                    />
                  )}
                </Box>
                
                {/* Company Name */}
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}
                  title={job.company_name}
                >
                  {job.company_name}
                </Typography>
              </Box>
            </Box>
            
            {/* Admin delete button */}
            {isAdmin && (
              <Tooltip title="Delete job listing">
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  color="error"
                  sx={{ 
                    ml: 1, 
                    flexShrink: 0,
                    '&:hover': {
                      bgcolor: 'error.light'
                    }
                  }}
                  aria-label="Delete job listing"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Job Details - Fixed height */}
          <Stack 
            spacing={1} 
            sx={{ 
              mb: 2,
              minHeight: 80, // Fixed details height
              maxHeight: 80,
              overflow: 'hidden'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, flexShrink: 0 }} />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
                title={job.location}
              >
                {job.location}
              </Typography>
            </Box>
            
            {job.expectedSalary && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {(!country || country === "India") ? (
                  <CurrencyRupeeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, flexShrink: 0 }} />
                ) : (
                  <SalaryIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, flexShrink: 0 }} />
                )}
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                  title={getSalaryRange(job.expectedSalary)}
                >
                  {getSalaryRange(job.expectedSalary)}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, flexShrink: 0 }} />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
                title={getDaysAgo(job.post_date)}
              >
                {getDaysAgo(job.post_date)}
              </Typography>
            </Box>
          </Stack>
          
          <Divider sx={{ my: 1 }} />
          
          {/* Skills Section - Fixed height */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 0.5,
              overflow: 'hidden',
              maxHeight: '56px', // Fixed skills height
              alignContent: 'flex-start'
            }}>
               <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 1, 
                fontWeight: 500,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                 mr: 1,
              }}
            >
              Skills:
            </Typography>
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
                    height: 24,
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    color: 'text.secondary',
                    borderColor: 'text.secondary'
                  }}
                />
              )}
            </Box>
          </Box>
          
          {/* Action button - Fixed at bottom */}
          <Box sx={{ mt: "auto", pt: 0 }} >
            <Button
              size="small"
              variant="outlined"
              fullWidth
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 500,
                
                height: 30,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white'
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick(e);
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default React.memo(JobCard);