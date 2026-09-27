import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'CONSUMER' | 'BUSINESS_OWNER' | 'ADMIN';
  is_active: boolean;
  phone?: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: Error | null }>;
  googleSignIn: (token: string, role?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateRole: (role: 'CONSUMER' | 'BUSINESS_OWNER') => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.response?.data?.error || 'Login failed') };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      const res = await api.post('/auth/register', { email, password, full_name: fullName, role });
      setUser(res.data.user);
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.response?.data?.error || 'Registration failed') };
    }
  };

  const googleSignIn = async (token: string, role?: string) => {
    try {
      const res = await api.post('/auth/google', { token, role });
      setUser(res.data.user);
      return { error: null };
    } catch (error: any) {
      return { error: new Error(error.response?.data?.error || 'Google login failed') };
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
      window.location.replace('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const updateRole = async (role: 'CONSUMER' | 'BUSINESS_OWNER') => {
    try {
      const res = await api.put('/auth/role', { role });
      if (res.data.user) {
        setUser(res.data.user);
        toast.success(`Successfully switched to ${role === 'BUSINESS_OWNER' ? 'Business Owner' : 'Consumer'}`);
      }
      return { error: null };
    } catch (error: any) {
      const message = error.response?.data?.error || error.message;
      toast.error(message);
      return { error: new Error(message) };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user,
        loading,
        setUser,
        signIn,
        signUp,
        googleSignIn,
        signOut,
        refreshProfile,
        updateRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
