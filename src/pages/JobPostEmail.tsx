import React from 'react';
import '../css/JobPostEmail.css';

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  email: string;
  location?: string;
  type?: string;
}

const jobs: Job[] = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechNova',
    description: 'We are looking for a skilled frontend developer with React and TypeScript experience. Join our dynamic team to build cutting-edge web applications.',
    email: 'hr@technova.com',
    location: 'San Francisco, CA',
    type: 'Full-time'
  },
  {
    id: 2,
    title: 'Backend Engineer',
    company: 'CodeCrate',
    description: 'Join our team to work with Node.js and scalable backend services. Experience with microservices architecture and cloud platforms preferred.',
    email: 'careers@codecrate.io',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    id: 3,
    title: 'DevOps Associate',
    company: 'CloudForge',
    description: 'Help us build automated CI/CD pipelines and cloud infrastructure on AWS. Knowledge of Docker, Kubernetes, and Terraform is a plus.',
    email: 'jobs@cloudforge.com',
    location: 'New York, NY',
    type: 'Contract'
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'DesignHub',
    description: 'Create beautiful and intuitive user experiences. Proficiency in Figma, Adobe Creative Suite, and understanding of design systems required.',
    email: 'design@designhub.co',
    location: 'Austin, TX',
    type: 'Full-time'
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'DataMind',
    description: 'Analyze complex datasets and build machine learning models. Strong background in Python, R, and statistical analysis required.',
    email: 'talent@datamind.ai',
    location: 'Boston, MA',
    type: 'Full-time'
  },
  {
    id: 6,
    title: 'Mobile Developer',
    company: 'AppWorks',
    description: 'Develop cross-platform mobile applications using React Native or Flutter. Experience with native iOS/Android development is a bonus.',
    email: 'mobile@appworks.dev',
    location: 'Seattle, WA',
    type: 'Part-time'
  }
];

const JobPostEmail: React.FC = () => {
  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="job-opportunities-container">
      <div className="hero-section">
        <h1 className="page-title">Current Job Opportunities</h1>
        <p className="page-subtitle">Discover your next career opportunity with our partner companies</p>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <h2 className="job-title">{job.title}</h2>
              <div className="job-meta">
                <span className="company-name">{job.company}</span>
                {job.location && <span className="job-location">📍 {job.location}</span>}
                {job.type && <span className={`job-type ${job.type.toLowerCase().replace('-', '')}`}>{job.type}</span>}
              </div>
            </div>
            
            <p className="job-description">{job.description}</p>
            
            <div className="job-footer">
              <div className="contact-info">
                <span className="email-label">Contact Recruiter:</span>
                <button 
                  className="email-button"
                  onClick={() => handleEmailClick(job.email)}
                  aria-label={`Send email to ${job.email}`}
                >
                  <span className="email-icon">📧</span>
                  {job.email}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h3>Don't see the right fit?</h3>
          <p>New opportunities are added regularly. Check back soon or reach out to us directly.</p>
        </div>
      </div>
    </div>
  );
};

export default JobPostEmail;
