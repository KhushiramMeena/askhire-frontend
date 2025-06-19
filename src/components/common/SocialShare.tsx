// import React, { useCallback } from 'react';
// import {
//   Box,
//   IconButton,
//   Tooltip,
//   Button,
//   useTheme,
//   useMediaQuery,
//   Chip
// } from '@mui/material';
// import {
//   Share as ShareIcon,
//   Twitter as TwitterIcon,
//   LinkedIn as LinkedInIcon,
//   WhatsApp as WhatsAppIcon,
//   Telegram as TelegramIcon,
//   ContentCopy as CopyIcon
// } from '@mui/icons-material';

// // Type declaration for gtag
// declare global {
//   interface Window {
//     gtag: (...args: any[]) => void;
//   }
// }

// interface SocialShareProps {
//   url?: string;
//   title?: string;
//   description?: string;
//   hashtags?: string[];
//   size?: 'small' | 'medium' | 'large';
//   variant?: 'icons' | 'buttons' | 'chips';
//   showLabels?: boolean;
//   showCopyLink?: boolean;
//   onShare?: (platform: string) => void;
// }

// const SocialShare: React.FC<SocialShareProps> = ({
//   url = window.location.href,
//   title = document.title,
//   description = 'Check out this amazing job opportunity on AskHire',
//   hashtags = ['jobs', 'askhire', 'career', 'hiring'],
//   size = 'medium',
//   variant = 'icons',
//   showLabels = false,
//   showCopyLink = true,
//   onShare
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const encodedUrl = encodeURIComponent(url);
//   const encodedTitle = encodeURIComponent(title);
//   const encodedDescription = encodeURIComponent(description);
//   const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');

//   const socialPlatforms = [
//     {
//       name: 'Twitter',
//       icon: <TwitterIcon />,
//       color: '#1DA1F2',
//       url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags.join(',')}`,
//       ariaLabel: 'Share on Twitter'
//     },
//     {
//       name: 'LinkedIn',
//       icon: <LinkedInIcon />,
//       color: '#0077B5',
//       url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
//       ariaLabel: 'Share on LinkedIn'
//     },
//     {
//       name: 'WhatsApp',
//       icon: <WhatsAppIcon />,
//       color: '#25D366',
//       url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
//       ariaLabel: 'Share on WhatsApp'
//     },
//     {
//       name: 'Telegram',
//       icon: <TelegramIcon />,
//       color: '#0088CC',
//       url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
//       ariaLabel: 'Share on Telegram'
//     }
//   ];

//   const handleShare = useCallback((platform: string, shareUrl: string) => {
//     // Track share event
//     if (window.gtag) {
//       window.gtag('event', 'share', {
//         method: platform,
//         content_type: 'job_listing',
//         content_id: url
//       });
//     }

//     // Call onShare callback if provided
//     if (onShare) {
//       onShare(platform);
//     }

//     // Open share window
//     if (platform === 'copy') {
//       navigator.clipboard.writeText(url).then(() => {
//         // You could show a toast notification here
//         console.log('Link copied to clipboard');
//       });
//     } else {
//       window.open(
//         shareUrl,
//         `share-${platform}`,
//         'width=600,height=400,scrollbars=yes,resizable=yes'
//       );
//     }
//   }, [url, onShare]);

//   const handleNativeShare = useCallback(async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title,
//           text: description,
//           url
//         });
        
//         if (onShare) {
//           onShare('native');
//         }
//       } catch (error) {
//         console.log('Native sharing failed:', error);
//       }
//     }
//   }, [title, description, url, onShare]);

//   const copyToClipboard = useCallback(() => {
//     handleShare('copy', '');
//   }, [handleShare]);

//   // Use native share API on mobile if available
//   const showNativeShare = isMobile && navigator.share;

//   if (showNativeShare) {
//     return (
//       <Button
//         startIcon={<ShareIcon />}
//         variant="outlined"
//         size={size}
//         onClick={handleNativeShare}
//         sx={{
//           borderColor: 'primary.main',
//           color: 'primary.main',
//           '&:hover': {
//             backgroundColor: 'primary.main',
//             color: 'white'
//           }
//         }}
//       >
//         Share
//       </Button>
//     );
//   }

//   if (variant === 'buttons') {
//     return (
//       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//         {socialPlatforms.map((platform) => (
//           <Button
//             key={platform.name}
//             startIcon={platform.icon}
//             variant="outlined"
//             size={size}
//             onClick={() => handleShare(platform.name.toLowerCase(), platform.url)}
//             sx={{
//               borderColor: platform.color,
//               color: platform.color,
//               '&:hover': {
//                 backgroundColor: platform.color,
//                 color: 'white'
//               }
//             }}
//           >
//             {showLabels ? platform.name : ''}
//           </Button>
//         ))}
//         {showCopyLink && (
//           <Button
//             startIcon={<CopyIcon />}
//             variant="outlined"
//             size={size}
//             onClick={copyToClipboard}
//             sx={{
//               borderColor: 'grey.500',
//               color: 'grey.700'
//             }}
//           >
//             {showLabels ? 'Copy Link' : ''}
//           </Button>
//         )}
//       </Box>
//     );
//   }

//   if (variant === 'chips') {
//     return (
//       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//         {socialPlatforms.map((platform) => (
//           <Chip
//             key={platform.name}
//             icon={platform.icon}
//             label={platform.name}
//             clickable
//             onClick={() => handleShare(platform.name.toLowerCase(), platform.url)}
//             sx={{
//               backgroundColor: `${platform.color}15`,
//               color: platform.color,
//               border: `1px solid ${platform.color}30`,
//               '&:hover': {
//                 backgroundColor: `${platform.color}25`
//               }
//             }}
//           />
//         ))}
//         {showCopyLink && (
//           <Chip
//             icon={<CopyIcon />}
//             label="Copy Link"
//             clickable
//             onClick={copyToClipboard}
//             sx={{
//               backgroundColor: 'grey.100',
//               color: 'grey.700',
//               '&:hover': {
//                 backgroundColor: 'grey.200'
//               }
//             }}
//           />
//         )}
//       </Box>
//     );
//   }

//   // Default: icons variant
//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//       {socialPlatforms.map((platform) => (
//         <Tooltip key={platform.name} title={platform.ariaLabel}>
//           <IconButton
//             size={size}
//             onClick={() => handleShare(platform.name.toLowerCase(), platform.url)}
//             aria-label={platform.ariaLabel}
//             sx={{
//               color: platform.color,
//               '&:hover': {
//                 backgroundColor: `${platform.color}15`
//               }
//             }}
//           >
//             {platform.icon}
//           </IconButton>
//         </Tooltip>
//       ))}
//       {showCopyLink && (
//         <Tooltip title="Copy link to clipboard">
//           <IconButton
//             size={size}
//             onClick={copyToClipboard}
//             aria-label="Copy link to clipboard"
//             sx={{
//               color: 'grey.600',
//               '&:hover': {
//                 backgroundColor: 'grey.100'
//               }
//             }}
//           >
//             <CopyIcon />
//           </IconButton>
//         </Tooltip>
//       )}
//     </Box>
//   );
// };

// // Enhanced social media buttons for job listings
// export const JobSocialShare: React.FC<{
//   jobTitle: string;
//   companyName: string;
//   jobUrl: string;
// }> = ({ jobTitle, companyName, jobUrl }) => {
//   const jobDescription = `${jobTitle} position at ${companyName} - Apply now on AskHire!`;
//   const jobHashtags = ['jobs', 'hiring', 'career', 'askhire', 'software', 'tech'];

//   return (
//     <SocialShare
//       url={jobUrl}
//       title={`${jobTitle} at ${companyName}`}
//       description={jobDescription}
//       hashtags={jobHashtags}
//       variant="icons"
//       size="small"
//       onShare={(platform) => {
//         // Track job sharing
//         if (window.gtag) {
//           window.gtag('event', 'share_job', {
//             job_title: jobTitle,
//             company_name: companyName,
//             share_platform: platform
//           });
//         }
//       }}
//     />
//   );
// };

// // Social media follow buttons for company pages
// export const SocialFollowButtons: React.FC<{
//   twitterUrl?: string;
//   linkedinUrl?: string;
//   facebookUrl?: string;
//   size?: 'small' | 'medium' | 'large';
// }> = ({ twitterUrl, linkedinUrl, facebookUrl, size = 'medium' }) => {
//   const socialLinks = [
//     twitterUrl && {
//       name: 'Twitter',
//       url: twitterUrl,
//       icon: <TwitterIcon />,
//       color: '#1DA1F2'
//     },
//     linkedinUrl && {
//       name: 'LinkedIn', 
//       url: linkedinUrl,
//       icon: <LinkedInIcon />,
//       color: '#0077B5'
//     },
//     facebookUrl && {
//       name: 'Facebook',
//       url: facebookUrl,
//       icon: <ShareIcon />, // Use a Facebook icon if available
//       color: '#1877F2'
//     }
//   ].filter(Boolean);

//   if (socialLinks.length === 0) return null;

//   return (
//     <Box sx={{ display: 'flex', gap: 1 }}>
//       {socialLinks.map((social) => (
//         <Button
//           key={social?.name}
//           component="a"
//           href={social!.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           startIcon={social!.icon}
//           variant="outlined"
//           size={size}
//           sx={{
//             borderColor: social!.color,
//             color: social!.color,
//             '&:hover': {
//               backgroundColor: social!.color,
//               color: 'white'
//             }
//           }}
//         >
//           Follow
//         </Button>
//       ))}
//     </Box>
//   );
// };

export {};