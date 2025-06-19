// src/pages/JobDetailPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Paper,
  Divider,
  Stack,
  Link,
  Breadcrumbs,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Tooltip,
  IconButton,
  Snackbar
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  AccessTime as TimeIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  HomeWork as WorkplaceIcon,
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon,
  OpenInNew as OpenInNewIcon,
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import InfoIcon from "@mui/icons-material/Info";
import CategoryIcon from "@mui/icons-material/Category";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CodeIcon from "@mui/icons-material/Code";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

import { Helmet } from "react-helmet-async";
import { useJobStore } from "../store/jobStore";
import { useAuthStore } from "../store/authStore";
import { formatSalary, getSalaryRange, getDaysAgo } from "../utils/formatters";
import AdBanner from "../components/common/AdBanner";
import Spinner from "../components/common/Spinner";

// For structured data
interface JobStructuredData {
  "@context": string;
  "@type": string;
  title: string;
  datePosted: string;
  validThrough?: string;
  description: string;
  hiringOrganization: {
    "@type": string;
    name: string;
    logo?: string;
  };
  jobLocation: {
    "@type": string;
    address: {
      "@type": string;
      addressLocality: string;
      streetAddress?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
  };
  employmentType?: string;
  baseSalary?: {
    "@type": string;
    currency: string;
    value: {
      "@type": string;
      minValue?: number;
      maxValue?: number;
      value?: number;
      unitText: string;
    };
  };
}

/**
 * JobDetailPage component for displaying detailed job information
 * Includes structured data for SEO
 */
const JobDetailPage: React.FC = () => {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const { getJob, currentJob, loading, error, jobs, fetchJobs } = useJobStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [structuredData, setStructuredData] =
    useState<JobStructuredData | null>(null);

  const [copied, setCopied] = useState(false);

  // const handleCopy = () => {
  //   navigator.clipboard.writeText(window.location.href).then(() => {
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   });
  // };
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (window.innerWidth < 768) {
      // Mobile: use snackbar
      setOpen(true);
    }
  };
  const handleCopy = () => {
    const textToCopy = window.location.href;

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      // Modern clipboard API
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Clipboard error:", err);
        });
    } else {
      // Fallback for older browsers (especially mobile)
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      textarea.style.position = "fixed"; // avoid scrolling to bottom
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }

      document.body.removeChild(textarea);
    }
  };

  // Fetch job and all jobs for similar jobs functionality
  useEffect(() => {
    // Fetch job with both ID and slug
    if (id) {
      getJob(Number(id), slug)
        .then((job) => {
          if (job && !slug) {
            // Create the slug and redirect to the proper URL
            const jobSlug = `${job.job_title
              .toLowerCase()
              .replace(/\s+/g, "-")}-at-${job.company_name
              .toLowerCase()
              .replace(/\s+/g, "-")}`;
            navigate(`/job/${id}/${jobSlug}`, { replace: true });
          }
        })
        .catch((error) => {
          // If we get a 404 error, it could be because of a slug mismatch
          // The component will show the "Job not found" message
        });
    }

    // Fetch all jobs for similar jobs functionality
    fetchJobs();
  }, [id, slug, getJob, navigate, fetchJobs]);

  // Set up structured data
  useEffect(() => {
    if (currentJob) {
      // Get location components
      const locationParts = currentJob.location.split(',').map(part => part.trim());
      const city = locationParts[0] || '';
      const region = locationParts[1] || '';
      
      // Calculate validThrough date - 30 days from posting
      const postDate = new Date(currentJob.post_date);
      const validThrough = new Date(postDate);
      validThrough.setDate(validThrough.getDate() + 30);
      
      // Create structured data for SEO
      const jobData: JobStructuredData = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: currentJob.job_title,
        datePosted: currentJob.post_date,
        validThrough: validThrough.toISOString(),
        description: currentJob.description,
        hiringOrganization: {
          "@type": "Organization",
          name: currentJob.company_name,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressRegion: region || 'Karnataka',
            streetAddress: "Not specified",
            postalCode: "560000",
            addressCountry: "IN"
          },
        },
      };

      if (currentJob.company_logo) {
        jobData.hiringOrganization.logo = currentJob.company_logo;
      }

      if (currentJob.employment_type) {
        jobData.employmentType = currentJob.employment_type;
      }

      if (currentJob.expectedSalary) {
        // Calculate min and max for salary range
        const min = Math.floor(currentJob.expectedSalary * 0.9);
        const max = Math.ceil(currentJob.expectedSalary * 1.1);

        jobData.baseSalary = {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            minValue: min,
            maxValue: max,
            unitText: "YEAR",
          },
        };
      }

      setStructuredData(jobData);
    }
  }, [currentJob]);

  // Helper function to find similar jobs based on keywords in job title
  const findSimilarJobs = (job: any, allJobs: any, maxResults = 3) => {
    if (!job || !allJobs || allJobs.length === 0) return [];

    // Get keywords from the current job title
    const jobTitleWords = job.job_title
      .toLowerCase()
      .split(/\s+/)
      .filter(
        (word: any) =>
          word.length > 3 && !["and", "the", "for", "with"].includes(word)
      );

    // Score other jobs based on keyword matches
    const scoredJobs = allJobs
      .filter((j: any) => j.job_id !== job.job_id) // Exclude current job
      .map((j: any) => {
        const title = j.job_title.toLowerCase();
        let score = 0;

        // Score based on matching keywords
        jobTitleWords.forEach((word: any) => {
          if (title.includes(word)) {
            score += 1;
          }
        });

        // Bonus points for same location or company
        if (j.location === job.location) score += 0.5;
        if (j.company_name === job.company_name) score += 0.5;

        return { ...j, score };
      })
      .filter((j: any) => j.score > 0) // Only include jobs with some relevance
      .sort((a: any, b: any) => b.score - a.score) // Sort by highest score
      .slice(0, maxResults); // Limit results

    return scoredJobs;
  };

  // Get similar jobs using the helper function
  const similarJobs = useMemo(() => {
    return currentJob ? findSimilarJobs(currentJob, jobs) : [];
  }, [currentJob, jobs]);

  // Get workplace style
  const getWorkplaceTypeStyle = (type?: string) => {
    if (!type) return { bgcolor: "grey.200", color: "text.secondary" };

    switch (type.toLowerCase()) {
      case "remote":
        return { bgcolor: "info.100", color: "info.dark" };
      case "hybrid":
        return { bgcolor: "secondary.100", color: "secondary.dark" };
      case "on-site":
      case "onsite":
        return { bgcolor: "warning.100", color: "warning.dark" };
      default:
        return { bgcolor: "grey.200", color: "text.secondary" };
    }
  };

  const workplaceStyle = currentJob?.workplace
    ? getWorkplaceTypeStyle(currentJob.workplace)
    : getWorkplaceTypeStyle();

  // Remove page-specific spinner since we're using the global loader in index.html
  if (loading) {
    // Return null to let the global loader handle this state
    return null;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Paper
          sx={{
            p: 4,
            bgcolor: "error.light",
            color: "error.dark",
            borderLeft: 6,
            borderColor: "error.main",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Error loading job details
          </Typography>
          <Typography>
            There was a problem loading this job listing. Please try again
            later.
          </Typography>
          <Button
            component={RouterLink}
            to="/jobs"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Jobs
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!currentJob) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Paper
          sx={{
            p: 4,
            bgcolor: "warning.light",
            color: "warning.dark",
            borderLeft: 6,
            borderColor: "warning.main",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Job not found
          </Typography>
          <Typography>
            The job listing you're looking for doesn't exist or has been
            removed.
          </Typography>
          <Button
            component={RouterLink}
            to="/jobs"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Jobs
          </Button>
        </Paper>
      </Container>
    );
  }

  // Parse skills array
  const skills = currentJob.skills.split(",").map((skill) => skill.trim());

  // Create URL-friendly slug for the current job if needed

  const jobUrlSlugforSimilar = (job: any) => {
    // e.preventDefault();
    const jobUrlSlug = `${job.job_title
      .toLowerCase()
      .replace(/\s+/g, "-")}-at-${job.company_name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    // Use navigate to go to the job detail page with the proper slug
    navigate(`/job/${job.job_id}/${jobUrlSlug}`);
  };

  const jobSlug =
    slug ||
    `${currentJob.job_title
      .toLowerCase()
      .replace(/\s+/g, "-")}-at-${currentJob.company_name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  return (
    <>
      <Helmet>
        <title>{`${currentJob.job_title} at ${currentJob.company_name} | Askhire`}</title>
        <meta
          name="description"
          content={`Apply for ${currentJob.job_title} position at ${
            currentJob.company_name
          }. ${currentJob.description.substring(0, 150)}...`}
        />
        <meta
          property="og:title"
          content={`${currentJob.job_title} at ${currentJob.company_name}`}
        />
        <meta
          property="og:description"
          content={`Apply for ${currentJob.job_title} position at ${currentJob.company_name}. Location: ${currentJob.location}`}
        />
        <link rel="canonical" href={`/job/${currentJob.job_id}/${jobSlug}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Breadcrumbs - Hidden on mobile */}
        {!isMobile && (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
          >
            <Link component={RouterLink} to="/" color="inherit">
              Home
            </Link>
            <Link component={RouterLink} to="/jobs" color="inherit">
              Jobs
            </Link>
            <Typography color="text.primary">{currentJob.job_title}</Typography>
          </Breadcrumbs>
        )}

        {/* Back to Jobs Button */}
        <Button
          component={RouterLink}
          to="/jobs"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
          size={isMobile ? "small" : "medium"}
        >
          Back to Jobs
        </Button>

        {/* Job Header */}
        <Paper
          elevation={2}
          sx={{
            mb: 4,
            overflow: "hidden",
            borderRadius: { xs: 2, md: 3 },
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: 6,
            },
          }}
        >
          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              background: `linear-gradient(to right, ${theme.palette.primary.light}15, ${theme.palette.background.paper})`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", mb: { xs: 2, sm: 0 } }}>
                {/* Company Logo/Avatar */}
                {currentJob.company_logo ? (
                  <Avatar
                    src={currentJob.company_logo}
                    alt={`${currentJob.company_name} logo`}
                    sx={{
                      width: { xs: 60, md: 80 },
                      height: { xs: 60, md: 80 },
                      mr: { xs: 2, md: 3 },
                      bgcolor: "primary.light",
                      boxShadow: 2,
                    }}
                    variant="rounded"
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: { xs: 60, md: 80 },
                      height: { xs: 60, md: 80 },
                      mr: { xs: 2, md: 3 },
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      fontSize: { xs: "1.5rem", md: "2rem" },
                      boxShadow: 2,
                    }}
                    variant="rounded"
                  >
                    {currentJob.company_name.charAt(0).toUpperCase()}
                  </Avatar>
                )}

                {/* Job Title & Company Info */}
                <Box>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      lineHeight: 1.2,
                    }}
                  >
                    {currentJob.job_title}
                  </Typography>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                    gutterBottom
                  >
                    {currentJob.company_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getDaysAgo(currentJob.post_date)}
                  </Typography>

                  {/* Action buttons for mobile view */}
                  {isMobile && (
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        href={currentJob.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ borderRadius: 2 }}
                      >
                        Apply Now
                      </Button>
                      {/* <Button
                        variant="outlined"
                        sx={{ minWidth: 0, borderRadius: 2 }}
                      >
                        <BookmarkIcon fontSize="small" />
                      </Button> */}
                      <Tooltip title={copied ? "Copied!" : "Copy link"}>
                        <Button
                          onClick={handleCopy}
                          variant="outlined"
                          sx={{ minWidth: 0, borderRadius: 2 }}
                        >
                          <ShareIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Stack>
                  )}
                </Box>
              </Box>

              {/* Apply Button - Desktop view */}
              {!isMobile && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Stack direction="row" spacing={1}>
                    {/* <Button
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      <BookmarkIcon fontSize="small" />
                    </Button> */}
                    {/* <Button
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >f
                      <ShareIcon fontSize="small" />
                    </Button> */}
                    <Tooltip title={copied ? "Copied!" : "Copy link"}>
                      <Button
                        onClick={handleCopy}
                        variant="outlined"
                        sx={{ minWidth: 0, borderRadius: 2 }}
                      >
                        <ShareIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      href={currentJob.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewIcon />}
                      sx={{
                        px: { sm: 2, md: 4 },
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: 3,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      Apply Now
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
          </Box>

          {/* Job Highlights */}
          <Box
            sx={{
              mb: 2,
              mx: 5,
              p: 1,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                display: "flex",
                alignItems: "center",
              }}
            >
              <StarBorderIcon
                fontSize="small"
                sx={{ mr: 1, color: theme.palette.warning.main }}
              />
              Key Highlights
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2.5,
                mt: 1.5,
              }}
            >
              <Chip
                icon={<LocationIcon />}
                label={currentJob.location}
                sx={{
                  bgcolor: `${theme.palette.warning.main}15`,
                  color: theme.palette.warning.dark,
                  fontWeight: 500,
                  "& .MuiChip-icon": { color: theme.palette.warning.main },
                }}
              />

              <Chip
                icon={<WorkplaceIcon />}
                label={currentJob.workplace}
                sx={{
                  bgcolor: `${theme.palette.info.main}15`,
                  color: theme.palette.info.dark,
                  fontWeight: 500,
                  "& .MuiChip-icon": { color: theme.palette.info.main },
                }}
              />

              <Chip
                icon={<AccessTimeIcon />}
                label={currentJob.employment_type || "Full-time"}
                sx={{
                  bgcolor: `${theme.palette.secondary.main}15`,
                  color: theme.palette.secondary.dark,
                  fontWeight: 500,
                  "& .MuiChip-icon": {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
              <Chip
                icon={<CurrencyRupeeIcon />}
                label={`${getSalaryRange(currentJob.expectedSalary || 0)}`}
                sx={{
                  bgcolor: `${theme.palette.success.main}15`,
                  color: theme.palette.success.dark,
                  fontWeight: 500,
                  "& .MuiChip-icon": { color: theme.palette.success.main },
                }}
              />
              {/* <Tooltip
                title="Note: Salary/Stipend figures are estimates gathered from sources like Glassdoor and Quora. AskHire does not guarantee their accuracy."
                placement="right"
                arrow
              >
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip> */}

<Tooltip
        title="Note: Salary/Stipend figures are estimates gathered from sources like Glassdoor and Quora. AskHire does not guarantee their accuracy."
        placement="right"
        arrow
        disableHoverListener={window.innerWidth < 768}
      >
        <IconButton
          size="small"
          sx={{ ml: 1 }}
          onClick={handleClick}
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Snackbar for mobile */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        message="Salary/Stipend figures are estimates from sources like Glassdoor and Quora. AskHire does not guarantee their accuracy."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
            </Box>
          </Box>
        </Paper>

        {/* AdSense Banner */}
        {/* <Box sx={{ display: { xs: "none", md: "block" }, mb: 4 }}>
          <AdBanner slotId="1234567890" format="leaderboard" />
        </Box> */}

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 4 },
          }}
        >
          {/* Main Content Column */}
          <Box
            sx={{
              flex: "1 1 auto",
              width: { xs: "100%", md: "65%" },
              order: { xs: 1, md: 1 },
            }}
          >
            {/* Job Description */}
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: { xs: 2, md: 3 },
                transition: "all 0.3s ease",
                mb: 4,
                overflow: "hidden",
                position: "relative",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "5px",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              {/* Header with icon */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <WorkIcon
                  color="primary"
                  sx={{
                    fontSize: { xs: 24, md: 28 },
                    mr: 1.5,
                    p: 1,
                    borderRadius: "50%",
                    bgcolor: `${theme.palette.primary.main}15`,
                  }}
                />
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  Job Description
                </Typography>
              </Box>

              <Divider
                sx={{
                  mb: 3,
                  opacity: 0.8,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}50, transparent)`,
                  height: "2px",
                }}
              />

              {/* Job Description Content */}
              <Box
                dangerouslySetInnerHTML={{
                  __html: currentJob.description
                    .replace(/\n/g, "<br />")
                    // Enhance headings and lists
                    .replace(
                      /<strong>(.*?)<\/strong>/g,
                      '<strong style="color:' +
                        theme.palette.primary.main +
                        '">$1</strong>'
                    )
                    .replace(
                      /<h(\d)>(.*?)<\/h\1>/g,
                      '<h$1 style="color:' +
                        theme.palette.primary.main +
                        '; margin-top:16px; margin-bottom:8px;">$2</h$1>'
                    )
                    .replace(
                      /<ul>/g,
                      '<ul style="padding-left:20px; margin-bottom:16px;">'
                    )
                    .replace(
                      /<li>/g,
                      '<li style="margin-bottom:8px; position:relative;">'
                    ),
                }}
                sx={{
                  mt: 3,
                  px: { xs: 0, sm: 1 },
                  color: "text.primary",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  "& p": { mb: 2 },
                  "& ul, & ol": { pl: 3, mb: 2 },
                  "& li": { mb: 1 },
                  "& a": {
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  },
                }}
              />

              {/* Skills */}
              <Box
                sx={{
                  mt: 4,
                  p: 2.5,
                  bgcolor: `${theme.palette.background.default}80`,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CodeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Required Skills
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 2,
                    animation: "fadeIn 0.5s ease-in-out",
                  }}
                >
                  {skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      sx={{
                        bgcolor: `${theme.palette.primary.main}15`,
                        color: "primary.main",
                        fontWeight: 500,
                        borderRadius: 1.5,
                      }}
                    />
                  ))}
                </Box>
                {/* Additional Information */}
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Eligibility Information
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 2 }}
                  >
                    {/* Company Information */}
                    {/* <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <BusinessIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">Company</Typography>
        </Box>
        <Typography variant="body1" fontWeight={500}>{currentJob.company_name}</Typography>
      </Box> */}

                    {/* Industry */}
                    {/* <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CategoryIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">Industry</Typography>
        </Box>
        <Typography variant="body1" fontWeight={500}>Information Technology</Typography>
      </Box> */}

                    {/* Experience Level */}
                    {/* <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <WorkHistoryIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">Experience</Typography>
        </Box>
        <Typography variant="body1" fontWeight={500}>{"currentJob?.experienceLevel" || "2-5 years"}</Typography>
      </Box> */}

                    {/* Qualification */}
                    <Box sx={{ flex: "1 1 250px", minWidth: 0 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <SchoolIcon
                          color="primary"
                          fontSize="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Qualification
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={500}>
                        Eligible Batch :{" "}
                        <strong>
                          {currentJob.eligibleBatch || "Bachelor's degree"}
                        </strong>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Apply Button (Bottom) */}
              <Box
                sx={{
                  mt: 6,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  href={currentJob.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewIcon />}
                  sx={{
                    px: { xs: 4, md: 6 },
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "all 0.3s ease",
                    flex: { xs: "1 1 100%", sm: "0 1 auto" },
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  Apply for this role
                </Button>
                <Button
                  href={`https://www.google.com/search?q=about ${encodeURIComponent(
                    currentJob.company_name
                  )} company`}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewIcon />}
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    flex: { xs: "1 1 100%", sm: "0 1 auto" },
                  }}
                >
                  Learn more about {currentJob.company_name}
                </Button>
              </Box>
            </Paper>

            {/* Mobile Ad Banner */}
            <Box sx={{ display: { xs: "block", md: "none" }, my: 4 }}>
              {/* <AdBanner slotId="mobile-ad-1" format="large-mobile-banner" /> */}
            </Box>
          </Box>

          {/* Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", md: "35%" },
              flexShrink: 0,
              order: { xs: 2, md: 2 },
            }}
          >
            {/* Similar Jobs */}
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: { xs: 2, md: 3 },
                transition: "all 0.3s ease",
                mb: 3,
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  pb: 1,
                  borderBottom: `2px solid ${theme.palette.primary.light}`,
                }}
              >
                Similar Jobs
              </Typography>

              <List sx={{ mt: 2 }}>
                {similarJobs.length > 0 ? (
                  similarJobs.map((job: any) => (
                    <ListItem key={job.job_id} disablePadding sx={{ mb: 2 }}>
                      <Link
                        // component={RouterLink}
                        // to={`/job/${job.job_id}/${jobUrlSlug}`}
                        onClick={() => jobUrlSlugforSimilar(job)}
                        underline="none"
                        sx={{ width: "100%" }}
                      >
                        <Card
                          variant="outlined"
                          
                          sx={{
                            cursor: "pointer",
                            width: "100%",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              boxShadow: 2,
                              transform: "translateY(-2px)",
                              borderColor: "primary.main",
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <Typography
                              variant="subtitle2"
                              component="div"
                              sx={{
                                fontWeight: 600,
                                color: "text.primary",
                              }}
                            >
                              {job.job_title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {job.company_name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 1,
                              }}
                            >
                              <LocationIcon
                                fontSize="small"
                                sx={{
                                  color: "primary.main",
                                  fontSize: 16,
                                  mr: 0.5,
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {job.location}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Link>
                    </ListItem>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2, textAlign: "center" }}
                  >
                    No similar jobs found
                  </Typography>
                )}
              </List>

              <Button
                component={RouterLink}
                to="/jobs"
                variant="text"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
              >
                View all jobs
              </Button>
            </Paper>

            {/* AdSense Banner */}
            {/* <Box sx={{ mt: 3 }}>
              <AdBanner slotId="9876543210" format="rectangle" />
            </Box> */}
          </Box>
        </Box>

        {/* Bottom AdSense Banner */}
        {/* <Box sx={{ mt: 6 }}>
          <AdBanner slotId="0987654321" format="leaderboard" />
        </Box> */}
      </Container>
    </>
  );
};

export default JobDetailPage;
