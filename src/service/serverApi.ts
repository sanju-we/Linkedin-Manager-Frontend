import axios from 'axios';
import toast from 'react-hot-toast';
import { env } from '@/lib/env';

const api = axios.create({
  baseURL: env.api.baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config;

    // 401 → session expired
    if (err.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      return Promise.reject(err);
    }

    // 403 → try refresh ONCE
    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch {
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
