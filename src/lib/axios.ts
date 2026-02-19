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


api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    
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


api.interceptors.response.use(
  (response) => {
  
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

    
    if (import.meta.env.DEV) {
      console.log(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }

   
    if (originalRequest?.url?.includes('/login/')) {
      return Promise.reject(error);
    }

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      
      const refreshToken1 = localStorage.getItem("refreshToken");
      
      if (!refreshToken1) {
        console.log('❌ No refresh token available');
        
       
        toast.error('Session expired. Please login again.', {
          duration: 5000,
          position: 'top-center',
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/auth/signIn'
          }
        });
        
       
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = '/auth/signIn';
        
        return Promise.reject(error);
      }

     
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
        
      
        toast.info('Refreshing session...', {
          duration: 2000,
          position: 'top-center',
        });


        const result = await store.dispatch(refreshToken()).unwrap();
        
        const newToken = result.access;
        
        console.log('✅ Token refresh successful');
 
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        
        processQueue(null, newToken);
        
       
        // toast.success('Session refreshed!', {
        //   duration: 2000,
        //   position: 'top-center',
        // });

        

        
        

        
        
        
        return api(originalRequest);
        
      } catch (refreshError) {
        console.log('❌ Token refresh failed:', refreshError);
        
      
        processQueue(refreshError, null);
        
      
        toast.error('Session expired. Please login again.', {
          duration: 5000,
          position: 'top-center',
          action: {
            label: 'Login',
            onClick: () => window.location.href = '/auth/signIn'
          }
        });
        
       
        store.dispatch(logout());
        
       
        window.location.href = '/auth/signIn';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.', {
        duration: 4000,
        position: 'top-center',
      });
    } 
    
    else if (error.response?.status === 404) {
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