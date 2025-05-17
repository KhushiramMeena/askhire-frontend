// src/store/jobStore.ts - Updated with fixed API handling
import { create } from "zustand";
import { api, authApi } from "../utils/config";
import { Job } from "../types/job";
import { sortJobsByDate } from "../utils/formatters";

interface PaginatedResponse {
  jobs: Job[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

interface JobStore {
  jobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  fetchJobs: (page?: number, perPage?: number) => Promise<void>; 
  fetchJobsWithSearch: (query: string, page?: number, perPage?: number) => Promise<void>;
  resetSearch: () => void;
  postJob: (jobData: Omit<Job, 'job_id' | 'post_date'>, token: string) => Promise<Job>;
  deleteJob: (jobId: number) => Promise<void>;
  getJob: (jobId: number, slug?: string) => Promise<Job | null>;
  setPage: (page: number) => void;
}

// Function to create URL-friendly slug from job title and company name
const createJobSlug = (job: Job): string => {
  return `${job.job_title.toLowerCase().replace(/\s+/g, '-')}-at-${job.company_name.toLowerCase().replace(/\s+/g, '-')}`;
};

// Zustand store
export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
  searchQuery: "",
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6
  },

  setPage: (page: number) => {
    const { searchQuery } = get();
    if (searchQuery) {
      // If there's an active search, fetch with the search term
      get().fetchJobsWithSearch(searchQuery, page);
    } else {
      // Otherwise do a normal fetch
      set(state => ({
        pagination: {
          ...state.pagination,
          currentPage: page
        }
      }));
      get().fetchJobs(page);
    }
  },

  fetchJobsWithSearch: async (query: string, page = 1, perPage = 6) => {
    set({ loading: true, error: null, searchQuery: query });
    try {
      const response = await api.get<PaginatedResponse>(
        `/jobs?page=${page}&per_page=${perPage}&search=${encodeURIComponent(query)}`
      );
      const sortedJobs = sortJobsByDate(response.data.jobs);
      set({ 
        jobs: sortedJobs, 
        loading: false,
        pagination: {
          currentPage: response.data.page,
          totalPages: response.data.pages,
          totalItems: response.data.total,
          itemsPerPage: response.data.per_page
        }
      });
      return;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  resetSearch: () => {
    set({ searchQuery: "" });
    get().fetchJobs(1);
  },

  fetchJobs: async (page = 1, perPage = 6) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<PaginatedResponse>(
        `/jobs?page=${page}&per_page=${perPage}`
      );
      const sortedJobs = sortJobsByDate(response.data.jobs);
      set({ 
        jobs: sortedJobs, 
        loading: false,
        pagination: {
          currentPage: response.data.page,
          totalPages: response.data.pages,
          totalItems: response.data.total,
          itemsPerPage: response.data.per_page
        }
      });
      return;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  postJob: async (jobData: any, token: string) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.post('/post-job', jobData);
      
      await get().fetchJobs(); 
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.message || "Failed to post job";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  getJob: async (jobId: number, slug?: string) => {
    set({ loading: true, error: null });
    try {
      // Use the API endpoint with the job ID
      // If a slug is provided, include it in the request for better SEO
      const endpoint = slug 
        ? `/job/${jobId}/${slug}` 
        : `/jobs/${jobId}`;
            // const endpoint = `/jobs/${jobId}`;
        
      const response = await api.get(endpoint);
      const job = response.data;
      
      // Add the slug to the job data if not present
      if (!job.slug) {
        job.slug = createJobSlug(job);
      }
      
      set({ currentJob: job, loading: false });
      return job;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  deleteJob: async (jobId: number) => {
    set({ loading: true, error: null });
    try {
      // Use the authenticated API instance which automatically adds the token
      await authApi.delete(`/jobs/${jobId}`);
      
      // After deletion, refresh the current page
      await get().fetchJobs(get().pagination.currentPage);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));