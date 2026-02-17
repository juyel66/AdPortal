import axios from "axios";
import { toast } from "sonner";
import { store } from "../store";
import {  logout, refreshToken } from "../features/auth/AuthThunks";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Track refresh state
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        hasToken: !!accessToken,
        tokenPreview: accessToken ? `${accessToken.substring(0, 15)}...` : 'none'
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        statusText: response.statusText
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (import.meta.env.DEV) {
      console.log(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }

    // Handle login errors (don't refresh)
    if (originalRequest?.url?.includes('/login/')) {
      return Promise.reject(error);
    }

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Check if we have a refresh token
      const refreshToken1 = localStorage.getItem("refreshToken");
      
      if (!refreshToken1) {
        console.log('❌ No refresh token available');
        
        // Show toast
        toast.error('Session expired. Please login again.', {
          duration: 5000,
          position: 'top-center',
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/auth/signIn'
          }
        });
        
        // Clear data and redirect
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = '/auth/signIn';
        
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 Attempting token refresh...');
        
        // Show toast notification
        toast.info('Refreshing session...', {
          duration: 2000,
          position: 'top-center',
        });

        // Dispatch refresh token action
        const result = await store.dispatch(refreshToken()).unwrap();
        
        const newToken = result.access;
        
        console.log('✅ Token refresh successful');
        
        // Update Authorization header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Process queued requests
        processQueue(null, newToken);
        
        // Show success toast (optional)
        toast.success('Session refreshed!', {
          duration: 2000,
          position: 'top-center',
        });
        
        // Retry the original request
        return api(originalRequest);
        
      } catch (refreshError) {
        console.log('❌ Token refresh failed:', refreshError);
        
        // Process queue with error
        processQueue(refreshError, null);
        
        // Show error toast
        toast.error('Session expired. Please login again.', {
          duration: 5000,
          position: 'top-center',
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/auth/signIn'
          }
        });
        
        // Dispatch logout to clear state
        store.dispatch(logout());
        
        // Redirect to login
        window.location.href = '/auth/signIn';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.', {
        duration: 4000,
        position: 'top-center',
      });
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.', {
        duration: 4000,
        position: 'top-center',
      });
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.', {
        duration: 4000,
        position: 'top-center',
      });
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.', {
        duration: 4000,
        position: 'top-center',
      });
    }

    return Promise.reject(error);
  }
);

export default api;