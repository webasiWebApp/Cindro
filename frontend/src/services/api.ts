import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('cindro_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // AUTH DISABLED — uncomment below to re-enable login redirect on 401
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('cindro_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
