// Enhanced SEO utilities for AskHire

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: object;
  robots?: string;
}

export interface JobSEOData {
  jobTitle: string;
  companyName: string;
  location: string;
  salary?: string;
  skills: string;
  employmentType?: string;
  datePosted: string;
}

// Primary keywords for different page types
export const PRIMARY_KEYWORDS = {
  homepage: [
    'jobs', 'software engineer', 'career', 'employment', 'askhire', 
    'find jobs', 'job search', 'dream job', 'browse jobs'
  ],
  jobs: [
    'browse jobs', 'software engineer jobs', 'tech jobs', 'career opportunities',
    'job listings', 'employment', 'hiring', 'skills', 'remote jobs'
  ],
  jobDetail: [
    'job details', 'apply job', 'software engineer position', 'career opportunity',
    'job description', 'requirements', 'salary', 'benefits'
  ],
  company: [
    'company jobs', 'employer', 'hiring company', 'job openings', 'career page'
  ]
} as const;

// Location-specific keywords for Indian job market
export const LOCATION_KEYWORDS = [
  'bengaluru', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune',
  'bangalore', 'gurgaon', 'noida', 'kolkata', 'india jobs'
];

// Industry-specific keywords
export const INDUSTRY_KEYWORDS = [
  'technology', 'IT', 'software', 'engineering', 'data science',
  'product management', 'design', 'marketing', 'finance', 'healthcare'
];

// Skill-based keywords
export const SKILL_KEYWORDS = [
  'javascript', 'python', 'react', 'nodejs', 'java', 'angular',
  'machine learning', 'aws', 'docker', 'kubernetes', 'sql'
];

/**
 * Generate optimized meta title
 */
export const generateMetaTitle = (
  pageType: keyof typeof PRIMARY_KEYWORDS,
  data?: Partial<JobSEOData>
): string => {
  const baseKeywords = PRIMARY_KEYWORDS[pageType];
  
  switch (pageType) {
    case 'homepage':
      return `Find Your Dream Job Today - AskHire | Software Engineer Jobs & Careers`;
    
    case 'jobs':
      if (data?.location) {
        return `Software Engineer Jobs in ${data.location} | Browse Tech Careers - AskHire`;
      }
      return `Browse Software Engineer Jobs | Tech Careers & Opportunities - AskHire`;
    
    case 'jobDetail':
      if (data?.jobTitle && data?.companyName) {
        return `${data.jobTitle} at ${data.companyName} | Software Engineer Job - AskHire`;
      }
      return `Software Engineer Job Details | Career Opportunity - AskHire`;
    
    case 'company':
      if (data?.companyName) {
        return `${data.companyName} Jobs | Software Engineer Careers - AskHire`;
      }
      return `Company Jobs | Software Engineer Opportunities - AskHire`;
    
    default:
      return `AskHire - Find Your Dream Job | Software Engineer Careers`;
  }
};

/**
 * Generate optimized meta description
 */
export const generateMetaDescription = (
  pageType: keyof typeof PRIMARY_KEYWORDS,
  data?: Partial<JobSEOData>
): string => {
  switch (pageType) {
    case 'homepage':
      return `Find your dream job at top companies like Barclays, Sage, Expedia Group. Browse software engineer jobs, tech careers, and opportunities with leading employers in India. Start your career journey today!`;
    
    case 'jobs':
      let jobsDesc = `Browse ${data?.location ? `software engineer jobs in ${data.location}` : 'software engineer and tech job opportunities'}. `;
      jobsDesc += `Find careers with top companies, filter by skills and location. `;
      jobsDesc += `Discover remote, hybrid, and onsite positions across India.`;
      return jobsDesc;
    
    case 'jobDetail':
      if (data?.jobTitle && data?.companyName && data?.location) {
        let detailDesc = `${data.jobTitle} position at ${data.companyName} in ${data.location}. `;
        detailDesc += data?.salary ? `Salary: ${data.salary}. ` : '';
        detailDesc += data?.skills ? `Required skills: ${data.skills.split(',').slice(0, 3).join(', ')}. ` : '';
        detailDesc += `Apply now for this software engineer career opportunity.`;
        return detailDesc;
      }
      return `Detailed job description for software engineer position. View requirements, salary, benefits and apply for this career opportunity.`;
    
    case 'company':
      if (data?.companyName) {
        return `Explore software engineer and tech job opportunities at ${data.companyName}. View open positions, company culture, and career growth prospects.`;
      }
      return `Browse company job listings and software engineer opportunities. Find your next career move with top employers.`;
    
    default:
      return `Find software engineer jobs and career opportunities with AskHire. Browse verified job listings from top companies across India.`;
  }
};

/**
 * Generate optimized keywords
 */
export const generateMetaKeywords = (
  pageType: keyof typeof PRIMARY_KEYWORDS,
  data?: Partial<JobSEOData>
): string => {
  const baseKeywords: string[] = [...PRIMARY_KEYWORDS[pageType]];
  
  // Add location-specific keywords
  if (data?.location) {
    const locationLower = data.location.toLowerCase();
    baseKeywords.push(locationLower, `${locationLower} jobs`);
  }
  
  // Add company-specific keywords
  if (data?.companyName) {
    const companyLower = data.companyName.toLowerCase();
    baseKeywords.push(companyLower, `${companyLower} jobs`, `${companyLower} careers`);
  }
  
  // Add skill-specific keywords
  if (data?.skills) {
    const skills = data.skills.split(',').map(skill => skill.trim().toLowerCase()).slice(0, 5);
    baseKeywords.push(...skills);
  }
  
  // Add employment type keywords
  if (data?.employmentType) {
    baseKeywords.push(data.employmentType.toLowerCase());
  }
  
  // Add some industry keywords
  baseKeywords.push(...INDUSTRY_KEYWORDS.slice(0, 3));
  
  return baseKeywords.join(', ');
};

/**
 * Generate structured data for job postings
 */
export const generateJobStructuredData = (jobData: JobSEOData) => {
  // Calculate validThrough - 30 days from the posting date
  const postDate = new Date(jobData.datePosted);
  const validThrough = new Date(postDate);
  validThrough.setDate(validThrough.getDate() + 30);
  
  // Extract location components
  const locationParts = jobData.location.split(',').map(part => part.trim());
  const city = locationParts[0] || '';
  const region = locationParts[1] || '';
  
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": jobData.jobTitle,
    "description": `${jobData.jobTitle} position at ${jobData.companyName} in ${jobData.location}`,
    "datePosted": jobData.datePosted,
    "validThrough": validThrough.toISOString(),
    "employmentType": jobData.employmentType || "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": jobData.companyName,
      "url": `https://askhire.in/company/${jobData.companyName.toLowerCase().replace(/\s+/g, '-')}`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": city,
        "addressRegion": region || 'Karnataka',
        "addressCountry": "IN",
        "streetAddress": "Not specified",
        "postalCode": city === "Bengaluru" || city === "Bangalore" ? "560000" : 
                       city === "Mumbai" ? "400000" : 
                       city === "Delhi" ? "110000" : 
                       city === "Hyderabad" ? "500000" : 
                       city === "Chennai" ? "600000" : 
                       city === "Pune" ? "411000" : 
                       "000000"
      }
    },
    "baseSalary": jobData.salary ? {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": jobData.salary,
        "unitText": "YEAR"
      }
    } : undefined,
    "skills": jobData.skills,
    "url": `https://askhire.in/job/${jobData.jobTitle.toLowerCase().replace(/\s+/g, '-')}-at-${jobData.companyName.toLowerCase().replace(/\s+/g, '-')}`
  };
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

/**
 * Update page SEO dynamically
 */
export const updatePageSEO = (metaTags: SEOMetaTags) => {
  // Update title
  if (metaTags.title) {
    document.title = metaTags.title;
  }
  
  // Update meta description
  updateMetaTag('name', 'description', metaTags.description);
  
  // Update keywords
  updateMetaTag('name', 'keywords', metaTags.keywords);
  
  // Update canonical URL
  if (metaTags.canonical) {
    updateLinkTag('canonical', metaTags.canonical);
  }
  
  // Update Open Graph tags
  if (metaTags.ogTitle) {
    updateMetaTag('property', 'og:title', metaTags.ogTitle);
  }
  if (metaTags.ogDescription) {
    updateMetaTag('property', 'og:description', metaTags.ogDescription);
  }
  if (metaTags.ogImage) {
    updateMetaTag('property', 'og:image', metaTags.ogImage);
  }
  if (metaTags.ogUrl) {
    updateMetaTag('property', 'og:url', metaTags.ogUrl);
  }
  
  // Update Twitter Card tags
  if (metaTags.twitterTitle) {
    updateMetaTag('name', 'twitter:title', metaTags.twitterTitle);
  }
  if (metaTags.twitterDescription) {
    updateMetaTag('name', 'twitter:description', metaTags.twitterDescription);
  }
  if (metaTags.twitterImage) {
    updateMetaTag('name', 'twitter:image', metaTags.twitterImage);
  }
  
  // Update robots tag
  if (metaTags.robots) {
    updateMetaTag('name', 'robots', metaTags.robots);
  }
  
  // Add structured data
  if (metaTags.structuredData) {
    addStructuredData(metaTags.structuredData);
  }
};

/**
 * Helper function to update meta tags
 */
const updateMetaTag = (attribute: string, value: string, content: string) => {
  let tag = document.querySelector(`meta[${attribute}="${value}"]`);
  
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('content', content);
};

/**
 * Helper function to update link tags
 */
const updateLinkTag = (rel: string, href: string) => {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('href', href);
};

/**
 * Helper function to add structured data
 */
const addStructuredData = (data: object) => {
  // Remove existing structured data for this type
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => {
    try {
      const scriptData = JSON.parse(script.textContent || '');
      if (scriptData['@type'] === (data as any)['@type']) {
        script.remove();
      }
    } catch (e) {
      // Ignore parsing errors
    }
  });
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Generate complete SEO meta tags for a page
 */
export const generateCompleteSEOTags = (
  pageType: keyof typeof PRIMARY_KEYWORDS,
  data?: Partial<JobSEOData>,
  customTitle?: string,
  customDescription?: string
): SEOMetaTags => {
  const title = customTitle || generateMetaTitle(pageType, data);
  const description = customDescription || generateMetaDescription(pageType, data);
  const keywords = generateMetaKeywords(pageType, data);
  
  return {
    title,
    description,
    keywords,
    canonical: window.location.href,
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://askhire.in/logo512.png',
    ogUrl: window.location.href,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: 'https://askhire.in/logo512.png',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large'
  };
};

/**
 * Track Core Web Vitals for SEO (fixed version)
 */
export const trackCoreWebVitals = () => {
  // Only track in browser environment
  if (typeof window === 'undefined' || !('performance' in window)) {
    return;
  }

  try {
    // Use PerformanceObserver API instead of web-vitals library
    if ('PerformanceObserver' in window) {
      // Track LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        console.log('LCP:', lastEntry.startTime);
        
        // Send to analytics safely
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'LCP',
            value: Math.round(lastEntry.startTime),
            event_category: 'Performance'
          });
        }
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('LCP observer not supported');
      }

      // Track CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        
        if (cls > 0) {
          console.log('CLS:', cls);
          
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'CLS',
              value: Math.round(cls * 1000) / 1000,
              event_category: 'Performance'
            });
          }
        }
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.log('CLS observer not supported');
      }
    }
  } catch (error) {
    console.log('Core Web Vitals tracking failed:', error);
  }
};

/**
 * Preload critical resources for better LCP
 */
export const preloadCriticalResources = (resources: string[]) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.includes('font')) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else {
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
    }
    
    link.href = resource;
    document.head.appendChild(link);
  });
};

export default {
  generateMetaTitle,
  generateMetaDescription,
  generateMetaKeywords,
  generateJobStructuredData,
  generateBreadcrumbStructuredData,
  updatePageSEO,
  generateCompleteSEOTags,
  trackCoreWebVitals,
  preloadCriticalResources,
  PRIMARY_KEYWORDS,
  LOCATION_KEYWORDS,
  INDUSTRY_KEYWORDS,
  SKILL_KEYWORDS
};