import api from '@/lib/axios';
import { useState, useEffect } from 'react';


export interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  is_admin: boolean;
}

export const useUserProfile = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/accounts/profile/');
        setUser(res.data);
      } catch (err) {
        console.error('Profile fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return {
    user,
    loading,
   
    id: user?.id,
    full_name: user?.full_name,
    email: user?.email,
    phone: user?.phone_number,
    is_admin: user?.is_admin,
  };
};