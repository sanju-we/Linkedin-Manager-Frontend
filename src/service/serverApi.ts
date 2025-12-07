import axios from 'axios';
import toast from 'react-hot-toast';
import { env } from '@/lib/env';

const api = axios.create({
  baseURL: env.api.baseURL,
  withCredentials: true,
  validateStatus: (status) => {
    return status !== 401 && status !== 403;
  },
  // Don't set default Content-Type - let axios handle it based on data type
  // FormData needs multipart/form-data with boundary, which axios sets automatically
});

// Request interceptor
api.interceptors.request.use(
  (request) => {
    // Log requests in development only
    if (process.env.NODE_ENV === 'development') {
      console.log('Request sent:', request.method?.toUpperCase(), request.url);
      if (request.data instanceof FormData) {
        console.log('FormData detected - Content-Type will be set automatically');
        // Log FormData contents (for debugging)
        for (const [key, value] of request.data.entries()) {
          if (value instanceof File) {
            console.log(`FormData field "${key}":`, {
              name: value.name,
              type: value.type,
              size: `${(value.size / 1024 / 1024).toFixed(2)} MB`,
            });
          } else {
            console.log(`FormData field "${key}":`, value);
          }
        }
      }
    }
    return request;
  },
  async (err) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Request error:', err);
    }
    return Promise.reject(err);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    const originalRequest = err.config;

    // Handle 401 Unauthorized
    if (err.response?.status === 401) {
      const errorMessage = err.response?.data?.message || 'Unauthorized. Please login again.';
      toast.error(errorMessage);
      
      // Clear cookies
      if (typeof document !== 'undefined') {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }

      // Redirect to login
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
      let redirectTo = '/login';
      
      // Handle admin routes
      if (pathname.startsWith('/admin')) {
        redirectTo = '/admin/login';
      }

      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 2000);
      }
    }

    // Handle 403 Forbidden - Try to refresh token
    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          env.api.refreshTokenURL,
          {},
          { withCredentials: true },
        );

        const accessToken = refreshRes.data?.data;
        
        if (accessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Refresh token failed:', refreshError);
        }
        
        // Clear cookies and redirect to login
        if (typeof document !== 'undefined') {
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(err);
  },
);

export default api;
