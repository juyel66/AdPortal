import { store } from "../store";
import { refreshToken } from "../features/auth/AuthThunks";

// Decode JWT token
export const decodeToken = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Get time until token expires (in seconds)
export const getTimeUntilExpiry = (token: string): number => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return 0;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - currentTime;
  } catch (error) {
    return 0;
  }
};

// Auto refresh setup
export const setupAutoTokenRefresh = (intervalMs: number = 4 * 60 * 1000) => {
  const interval = setInterval(async () => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken) return;
    
    const timeUntilExpiry = getTimeUntilExpiry(accessToken);
    
    // If token expires in less than 5 minutes, refresh it
    if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
      console.log(`⏰ Token expires in ${timeUntilExpiry}s, refreshing...`);
      
      try {
        await store.dispatch(refreshToken()).unwrap();
        console.log('✅ Token auto-refreshed');
      } catch (error) {
        console.log('❌ Auto-refresh failed');
      }
    }
  }, intervalMs);
  
  return () => clearInterval(interval);
};

// Check token on app load
export const checkTokenOnLoad = async (): Promise<boolean> => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken1 = localStorage.getItem("refreshToken");
  
  if (!accessToken || !refreshToken1) {
    return false;
  }
  
  // If token is expired, try to refresh
  if (isTokenExpired(accessToken)) {
    console.log('🔄 Token expired on load, refreshing...');
    
    try {
      const result = await store.dispatch(refreshToken()).unwrap();
      console.log('✅ Token refreshed on load');
      return !!result.access;
    } catch (error) {
      console.log('❌ Token refresh failed on load');
      return false;
    }
  }
  
  return true;
};