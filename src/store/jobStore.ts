// // src/store/jobStore.ts - Updated with fixed API handling
// import { create } from "zustand";
// import { api, authApi } from "../utils/config";
// import { Job } from "../types/job";
// import { sortJobsByDate } from "../utils/formatters";

// interface PaginatedResponse {
//   jobs: Job[];
//   total: number;
//   page: number;
//   per_page: number;
//   pages: number;
// }

// interface JobStore {
//   jobs: Job[];
//   currentJob: Job | null;
//   loading: boolean;
//   error: string | null;
//   searchQuery: string;
//   pagination: {
//     currentPage: number;
//     totalPages: number;
//     totalItems: number;
//     itemsPerPage: number;
//   };
//     // Add these new properties
//   filters: {
//     jobType: string;
//     location: string;
//     workplace: string;
//   };
  
//   // Add/modify these functions
//   fetchJobsWithFilters: (filters: Record<string, string>, page?: number, perPage?: number) => Promise<void>;
//   applyFilters: (filters: Record<string, string>) => void;
//   clearFilters: () => void;

//   fetchJobs: (page?: number, perPage?: number) => Promise<void>; 
//   fetchJobsWithSearch: (query: string, page?: number, perPage?: number) => Promise<void>;
//   resetSearch: () => void;
//   postJob: (jobData: Omit<Job, 'job_id' | 'post_date'>, token: string) => Promise<Job>;
//   deleteJob: (jobId: number) => Promise<void>;
//   getJob: (jobId: number, slug?: string) => Promise<Job | null>;
//   setPage: (page: number) => void;
// }

// // Function to create URL-friendly slug from job title and company name
// const createJobSlug = (job: Job): string => {
//   return `${job.job_title.toLowerCase().replace(/\s+/g, '-')}-at-${job.company_name.toLowerCase().replace(/\s+/g, '-')}`;
// };

// // Zustand store
// export const useJobStore = create<JobStore>((set, get) => ({
//   jobs: [],
//   currentJob: null,
//   loading: false,
//   error: null,
//   searchQuery: "",
//   pagination: {
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 6
//   },
//   // Add filters to store state
//   filters: {
//     jobType: '',
//     location: '',
//     workplace: ''
//   },
  
//  // Update setPage to respect filters
//   setPage: (page: number) => {
//     const { searchQuery, filters } = get();
    
//     // When changing pages, we need to pass all active filters
//     // and search query if present
//     set(state => ({
//       pagination: {
//         ...state.pagination,
//         currentPage: page
//       }
//     }));
    
//     get().fetchJobsWithFilters({
//       search: searchQuery,
//       ...filters
//     }, page);
//   },
// // Add new function to fetch with filters
// fetchJobsWithFilters: async (filters: Record<string, string>, page = 1, perPage = 6) => {
//     set({ loading: true, error: null });
//     try {
//       // Build query parameters
//       const queryParams = new URLSearchParams();
//       queryParams.append('page', page.toString());
//       queryParams.append('per_page', perPage.toString());
      
//       // Add all non-empty filters
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value) {
//           queryParams.append(key, value);
//         }
//       });
      
//       const response = await api.get<PaginatedResponse>(`/jobs?${queryParams.toString()}`);
//       const sortedJobs = sortJobsByDate(response.data.jobs);
      
//       set({ 
//         jobs: sortedJobs, 
//         loading: false,
//         pagination: {
//           currentPage: response.data.page,
//           totalPages: response.data.pages,
//           totalItems: response.data.total,
//           itemsPerPage: response.data.per_page
//         }
//       });
//       return;
//     } catch (error: any) {
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },


//   // Add function to apply filters
//   applyFilters: (newFilters: Record<string, string>) => {
//     // Store filters and make the backend call
//     set(state => ({ 
//       filters: {
//         jobType: newFilters.jobType || '',
//         location: newFilters.location || '',
//         workplace: newFilters.workplace || ''
//       }
//     }));
    
//     const { searchQuery } = get();
    
//     // Apply filters with current search query
//     get().fetchJobsWithFilters({
//       ...newFilters,
//       search: searchQuery || ''
//     }, 1); // Reset to page 1 when filters change
//   },
  
//   // Add function to clear filters
//   // clearFilters: () => {
//   //   const emptyFilters = {
//   //     jobType: '',
//   //     location: '',
//   //     workplace: ''
//   //   };
    
//   //   set({ filters: emptyFilters });
    
//   //   // Check if there's a search query
//   //   const { searchQuery } = get();
//   //   if (searchQuery) {
//   //     get().fetchJobsWithSearch(searchQuery, 1);
//   //   } else {
//   //     get().fetchJobs(1);
//   //   }
//   // },

//   clearFilters: () => {
//     const emptyFilters = {
//       jobType: '',
//       location: '',
//       workplace: ''
//     };
    
//     set({ filters: emptyFilters });
    
//     // Fetch with just the search query if present
//     const { searchQuery } = get();
//     get().fetchJobsWithFilters({
//       search: searchQuery || ''
//     }, 1);
//   },


// // Update fetchJobsWithSearch to handle filters
//   fetchJobsWithSearch: async (query: string, page = 1, perPage = 6) => {
//     set({ loading: true, error: null, searchQuery: query });
    
//     // Get the current filters and include them
//     const { filters } = get();
    
//     // Call fetchJobsWithFilters with both search and filters
//     return get().fetchJobsWithFilters({
//       ...filters,
//       search: query
//     }, page, perPage);
//   },

//   resetSearch: () => {
//     set({ searchQuery: "" });
    
//     // Keep any active filters
//     const { filters } = get();
//     get().fetchJobsWithFilters(filters, 1);
//   },

//   fetchJobs: async (page = 1, perPage = 6) => {
//     // Simple redirect to fetch with empty filters
//     return get().fetchJobsWithFilters({}, page, perPage);
//   },


//   postJob: async (jobData: any, token: string) => {
//     set({ loading: true, error: null });
//     try {
//       const response = await authApi.post('/post-job', jobData);
      
//       await get().fetchJobs(); 
//       set({ loading: false });
//       return response.data;
//     } catch (error: any) {
//       const errorMsg = error.response?.data?.detail || error.message || "Failed to post job";
//       set({ error: errorMsg, loading: false });
//       throw error;
//     }
//   },

//   getJob: async (jobId: number, slug?: string) => {
//     set({ loading: true, error: null });
//     try {
//       // Use the API endpoint with the job ID
//       // If a slug is provided, include it in the request for better SEO
//       const endpoint = slug 
//         ? `/job/${jobId}/${slug}` 
//         : `/jobs/${jobId}`;
//             // const endpoint = `/jobs/${jobId}`;
        
//       const response = await api.get(endpoint);
//       const job = response.data;
      
//       // Add the slug to the job data if not present
//       if (!job.slug) {
//         job.slug = createJobSlug(job);
//       }
      
//       set({ currentJob: job, loading: false });
//       return job;
//     } catch (error: any) {
//       set({ error: error.message, loading: false });
//       return null;
//     }
//   },

//   deleteJob: async (jobId: number) => {
//     set({ loading: true, error: null });
//     try {
//       // Use the authenticated API instance which automatically adds the token
//       await authApi.delete(`/jobs/${jobId}`);
      
//       // After deletion, refresh the current page
//       await get().fetchJobs(get().pagination.currentPage);
//       set({ loading: false });
//     } catch (error: any) {
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },
// }));






// src/store/jobStore.ts
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

interface FilterOptions {
  jobType: string;
  location: string;
  workplace: string;
}

interface JobStore {
  jobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeFilters: FilterOptions;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  fetchJobs: (page?: number, perPage?: number) => Promise<void>; 
  fetchJobsWithFilters: (options: Partial<FilterOptions & { search?: string }>, page?: number, perPage?: number) => Promise<void>;
  fetchJobsWithSearch: (query: string, page?: number, perPage?: number) => Promise<void>;
  applyFilter: (name: keyof FilterOptions, value: string) => void;
  removeFilter: (name: keyof FilterOptions) => void;
  clearAllFilters: () => void;
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
  activeFilters: {
    jobType: '',
    location: '',
    workplace: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6
  },

  setPage: (page: number) => {
    const { activeFilters, searchQuery } = get();
    
    // When changing pages, keep any active filters and search query
    get().fetchJobsWithFilters({
      ...activeFilters,
      search: searchQuery || ''
    }, page);
  },

  fetchJobsWithFilters: async (options: Partial<FilterOptions & { search?: string }>, page = 1, perPage = 6) => {
    set({ loading: true, error: null });
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('per_page', perPage.toString());
      
      // Add all non-empty filters
      Object.entries(options).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      const response = await api.get<PaginatedResponse>(`/jobs?${queryParams.toString()}`);
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

  applyFilter: (name: keyof FilterOptions, value: string) => {
    // Update the filter state
    set(state => ({
      activeFilters: {
        ...state.activeFilters,
        [name]: value
      }
    }));
    
    // Get latest state after update
    const { activeFilters, searchQuery } = get();
    
    // Apply all filters with search query
    get().fetchJobsWithFilters({
      ...activeFilters,
      search: searchQuery || ''
    }, 1); // Reset to page 1 when filters change
  },
  
  removeFilter: (name: keyof FilterOptions) => {
    // Update the filter state
    set(state => ({
      activeFilters: {
        ...state.activeFilters,
        [name]: ''
      }
    }));
    
    // Get latest state after update
    const { activeFilters, searchQuery } = get();
    
    // Re-fetch with updated filters
    get().fetchJobsWithFilters({
      ...activeFilters,
      search: searchQuery || ''
    }, 1);
  },
  
  clearAllFilters: () => {
    const emptyFilters = {
      jobType: '',
      location: '',
      workplace: ''
    };
    
    set({ activeFilters: emptyFilters });
    
    // Fetch with just the search query if present
    const { searchQuery } = get();
    get().fetchJobsWithFilters({
      search: searchQuery || ''
    }, 1);
  },

  fetchJobsWithSearch: async (query: string, page = 1, perPage = 6) => {
    set({ loading: true, error: null, searchQuery: query });
    
    // Get the current filters and include them
    const { activeFilters } = get();
    
    // Apply search with existing filters
    return get().fetchJobsWithFilters({
      ...activeFilters,
      search: query
    }, page, perPage);
  },

  resetSearch: () => {
    set({ searchQuery: "" });
    
    // Keep active filters
    const { activeFilters } = get();
    get().fetchJobsWithFilters(activeFilters, 1);
  },

  fetchJobs: async (page = 1, perPage = 6) => {
    // For initial load, we'll clear filters and search
    set({ 
      activeFilters: {
        jobType: '',
        location: '',
        workplace: ''
      },
      searchQuery: ""
    });
    return get().fetchJobsWithFilters({}, page, perPage);
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
      const { pagination, activeFilters, searchQuery } = get();
      
      // Keep any active filters when refreshing
      await get().fetchJobsWithFilters({
        ...activeFilters,
        search: searchQuery || ''
      }, pagination.currentPage);
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));