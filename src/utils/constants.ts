// src/utils/constants.ts
// Central file for all static text and constants in the application

// Site Information
export const SITE_INFO = {
  NAME: 'AskHire',
  TAGLINE: 'Find Your Dream Job',
  DOMAIN: 'askhire.in',
  DESCRIPTION: 'Find your dream job at top companies like Barclays, Sage, Expedia Group. Browse software engineer jobs, tech careers, and opportunities with leading employers in India.',
  COPYRIGHT: `© ${new Date().getFullYear()} AskHire. All rights reserved.`,
};

// Page Titles and Metadata
export const PAGE_TITLES = {
  HOME: 'Find Your Dream Job Today - AskHire | Software Engineer Jobs & Careers',
  JOBS: 'Browse Software Engineer Jobs | Tech Careers & Opportunities - AskHire',
  JOB_DETAIL: (jobTitle: string, companyName: string) => `${jobTitle} at ${companyName} | Askhire`,
  POST_JOB: 'Post a New Job | Askhire',
  ABOUT: 'About Us | Askhire',
  CONTACT: 'Contact Us | Askhire',
  PRIVACY_POLICY: 'Privacy Policy | Askhire',
  TERMS_OF_SERVICE: 'Terms of Service | Askhire',
  REGISTER: 'Create an Account | Askhire',
  LOGIN: 'Sign In | Askhire',
  PROFILE: 'Your Profile | Askhire',
  NOT_FOUND: 'Page Not Found | Askhire',
};

// Common UI Elements
export const UI_TEXT = {
  LOADING: {
    TITLE: 'Loading AskHire...',
    SUBTITLE: 'Finding your dream job opportunities',
  },
  BUTTONS: {
    APPLY: 'Apply Now',
    APPLY_ROLE: 'Apply for this role',
    SUBMIT: 'Submit',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    BACK: 'Back',
    BACK_TO_JOBS: 'Back to Jobs',
    VIEW_ALL_JOBS: 'View all jobs',
    POST_JOB: 'Post Job',
    LEARN_MORE: 'Learn more',
    SIGN_IN: 'Sign In',
    REGISTER: 'Register',
    LOGOUT: 'Logout',
    UPDATE: 'Update',
    DELETE: 'Delete',
    SHARE: 'Share',
    COPY_LINK: 'Copy link',
  },
  ALERTS: {
    SUCCESS: 'Success!',
    ERROR: 'Error',
    WARNING: 'Warning',
    INFO: 'Information',
    COPIED: 'Copied!',
  },
  FORM: {
    REQUIRED: 'This field is required',
    INVALID_URL: 'Please enter a valid URL',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_SALARY: 'Please enter a valid number',
    PASSWORD_MISMATCH: 'Passwords don\'t match',
  },
  ERRORS: {
    GENERIC: 'Something went wrong. Please try again later.',
    NOT_FOUND: 'The page you\'re looking for doesn\'t exist or has been removed.',
    JOB_NOT_FOUND: 'The job listing you\'re looking for doesn\'t exist or has been removed.',
    UNAUTHORIZED: 'You need to be logged in to access this page.',
    FORBIDDEN: 'You don\'t have permission to access this page.',
  },
};

// Job Page Text
export const JOB_TEXT = {
  JOB_DETAIL: {
    KEY_HIGHLIGHTS: 'Key Highlights',
    JOB_DESCRIPTION: 'Job Description',
    REQUIRED_SKILLS: 'Required Skills',
    ELIGIBILITY_INFO: 'Eligibility Information',
    QUALIFICATION: 'Qualification',
    ELIGIBLE_BATCH: 'Eligible Batch:',
    SIMILAR_JOBS: 'Similar Jobs',
    COMPANY_LEARN_MORE: (companyName: string) => `Learn more about ${companyName}`,
    SALARY_NOTE: 'Note: Salary/Stipend figures are estimates gathered from sources like Glassdoor and Quora. AskHire does not guarantee their accuracy.',
    NO_SIMILAR_JOBS: 'No similar jobs found',
  },
  JOB_FORM: {
    TITLE: 'Post a New Job',
    FIELDS: {
      JOB_TITLE: 'Job Title',
      JOB_TITLE_PLACEHOLDER: 'e.g. Senior React Developer',
      COMPANY_NAME: 'Company Name',
      COMPANY_NAME_PLACEHOLDER: 'e.g. Acme Inc.',
      LOCATION: 'Location',
      LOCATION_PLACEHOLDER: 'e.g. Bengaluru, Karnataka',
      WORKPLACE_TYPE: 'Workplace Type',
      EMPLOYMENT_TYPE: 'Employment Type',
      EXPECTED_SALARY: 'Expected Salary (INR per year)',
      EXPECTED_SALARY_PLACEHOLDER: 'e.g. 1200000',
      ELIGIBLE_BATCH: 'Eligible Batch',
      ELIGIBLE_BATCH_PLACEHOLDER: 'e.g. 2020-2024',
      SKILLS: 'Skills Required',
      SKILLS_PLACEHOLDER: 'e.g. React, TypeScript, NodeJS (comma separated)',
      COMPANY_LOGO: 'Company Logo URL',
      COMPANY_LOGO_PLACEHOLDER: 'e.g. https://example.com/logo.png',
      APPLICATION_URL: 'Application URL',
      APPLICATION_URL_PLACEHOLDER: 'e.g. https://example.com/careers/apply',
      DESCRIPTION: 'Job Description',
      DESCRIPTION_PLACEHOLDER: 'Enter detailed job description, responsibilities, requirements, etc.',
    },
    BUTTONS: {
      POST_JOB: 'Post Job',
      POSTING_JOB: 'Posting Job...',
    },
    ERRORS: {
      SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    },
  },
  WORKPLACE_TYPES: ['Remote', 'Hybrid', 'Onsite'],
  EMPLOYMENT_TYPES: [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship',
    'Volunteer',
    'Freelance'
  ],
};

// Home Page Text
export const HOME_TEXT = {
  HERO: {
    TITLE: 'Find Your Dream Job',
    SUBTITLE: 'Discover opportunities at top companies across India',
    CTA: 'Browse Jobs',
  },
  FEATURED_SECTION: {
    TITLE: 'Featured Jobs',
    SUBTITLE: 'Handpicked opportunities from top companies',
    VIEW_ALL: 'View All Jobs',
  },
  COMPANIES_SECTION: {
    TITLE: 'Top Companies Hiring',
    SUBTITLE: 'Join industry leaders and innovative startups',
  },
  HOW_IT_WORKS: {
    TITLE: 'How It Works',
    SUBTITLE: 'Your path to career success',
    STEPS: [
      {
        TITLE: 'Search',
        DESCRIPTION: 'Find jobs matching your skills and experience',
      },
      {
        TITLE: 'Apply',
        DESCRIPTION: 'Submit your application with one click',
      },
      {
        TITLE: 'Interview',
        DESCRIPTION: 'Showcase your abilities to potential employers',
      },
      {
        TITLE: 'Get Hired',
        DESCRIPTION: 'Start your new career journey',
      },
    ],
  },
};

// Authentication Page Text
export const AUTH_TEXT = {
  LOGIN: {
    TITLE: 'Sign In',
    SUBTITLE: 'Welcome back! Sign in to your account',
    EMAIL_LABEL: 'Email',
    EMAIL_PLACEHOLDER: 'your.email@example.com',
    PASSWORD_LABEL: 'Password',
    REMEMBER_ME: 'Remember me',
    FORGOT_PASSWORD: 'Forgot password?',
    SIGN_IN_BUTTON: 'Sign In',
    NO_ACCOUNT: 'Don\'t have an account?',
    REGISTER_LINK: 'Register now',
    ERRORS: {
      INVALID_CREDENTIALS: 'Invalid email or password',
      GENERIC_ERROR: 'Error signing in. Please try again.',
    },
  },
  REGISTER: {
    TITLE: 'Create an Account',
    SUBTITLE: 'Join AskHire to find your dream job',
    NAME_LABEL: 'Full Name',
    NAME_PLACEHOLDER: 'John Doe',
    EMAIL_LABEL: 'Email',
    EMAIL_PLACEHOLDER: 'your.email@example.com',
    PASSWORD_LABEL: 'Password',
    PASSWORD_PLACEHOLDER: 'Create a strong password',
    CONFIRM_PASSWORD_LABEL: 'Confirm Password',
    TERMS_AGREE: 'I agree to the Terms of Service and Privacy Policy',
    REGISTER_BUTTON: 'Create Account',
    HAVE_ACCOUNT: 'Already have an account?',
    LOGIN_LINK: 'Sign in',
    ERRORS: {
      EMAIL_EXISTS: 'An account with this email already exists',
      GENERIC_ERROR: 'Error creating account. Please try again.',
    },
  },
};

// Footer Links
export const FOOTER_LINKS = {
  COMPANY: {
    TITLE: 'Company',
    LINKS: [
      { LABEL: 'About Us', HREF: '/about' },
      { LABEL: 'Contact Us', HREF: '/contact' },
      { LABEL: 'Careers', HREF: '/careers' },
      { LABEL: 'Press', HREF: '/press' },
    ],
  },
  RESOURCES: {
    TITLE: 'Resources',
    LINKS: [
      { LABEL: 'Blog', HREF: '/blog' },
      { LABEL: 'Job Search Tips', HREF: '/job-search-tips' },
      { LABEL: 'Career Advice', HREF: '/career-advice' },
      { LABEL: 'Developer Resources', HREF: '/resources' },
    ],
  },
  LEGAL: {
    TITLE: 'Legal',
    LINKS: [
      { LABEL: 'Terms of Service', HREF: '/terms-of-service' },
      { LABEL: 'Privacy Policy', HREF: '/privacy-policy' },
      { LABEL: 'Cookie Policy', HREF: '/cookie-policy' },
      { LABEL: 'DMCA', HREF: '/dmca' },
    ],
  },
};

// Breadcrumb texts
export const BREADCRUMB_TEXT = {
  HOME: 'Home',
  JOBS: 'Jobs',
  ABOUT: 'About Us',
  CONTACT: 'Contact Us',
  PRIVACY: 'Privacy Policy',
  TERMS: 'Terms of Service',
  PROFILE: 'Profile',
};

// SEO Related Text
export const SEO_TEXT = {
  DEFAULT_KEYWORDS: 'jobs, software engineer, career, tech jobs, india, employment, hiring, askhire',
  OG_SITE_NAME: 'AskHire',
  TWITTER_HANDLE: '@AskHire',
};

export default {
  SITE_INFO,
  PAGE_TITLES,
  UI_TEXT,
  JOB_TEXT,
  HOME_TEXT,
  AUTH_TEXT,
  FOOTER_LINKS,
  BREADCRUMB_TEXT,
  SEO_TEXT,
}; 