// src/types/job.ts

export interface Job {
    job_id: number;
    job_title: string;
    company_name: string;
    description: string;
    location: string;
    post_date: string;
    skills: string;
    expectedSalary?: number;
    eligibleBatch?: string;
    company_logo?: string;
    employment_type?: string;
    apply_link: string;
    workplace?: string;
  }
  
  export interface PaginationState {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }
  
  export interface JobFormData {
    job_title: string;
    company_name: string;
    company_logo: string;
    description: string;
    expectedSalary: string | number;
    eligibleBatch: string;
    location: string;
    skills: string;
    employment_type: string;
    apply_link: string;
    workplace: string;
  }