
import axios from 'axios';

// Base API URL
// const API_BASE_URL = 'http://192.168.204.221:8000/api';
// const API_BASE_URL = `${window.location.origin}/api`;
// const API_BASE_URL = 'http://askhire.in:8000/api';
const isLocal = window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.');
const API_BASE_URL = isLocal
  ? 'http://192.168.204.221:8000/api'
  : '/api';


export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create authenticated axios instance that automatically adds auth header
export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the correct header format - use x-user-token instead of Authorization
      config.headers['x-user-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't immediately clear auth data for ALL 401 errors
      // Check if this is a job submission error, which might need different handling
      if (!error.config.url.includes('/post-job')) {
        // Clear auth data on 401 Unauthorized for non-job submissions
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('auth_integrity');
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);



