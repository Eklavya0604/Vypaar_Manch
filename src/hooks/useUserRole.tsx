import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'CONSUMER' | 'BUSINESS_OWNER' | 'STAFF' | 'ADMIN';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export function useUserRole() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [primaryRole, setPrimaryRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setPrimaryRole(null);
      setLoading(false);
      return;
    }

    fetchRoles();
  }, [user]);

  const fetchRoles = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching roles:', error);
      setLoading(false);
      return;
    }

    setRoles(data || []);
    
    // Determine primary role (priority: ADMIN > BUSINESS_OWNER > STAFF > CONSUMER)
    const roleOrder: AppRole[] = ['ADMIN', 'BUSINESS_OWNER', 'STAFF', 'CONSUMER'];
    const userRoles = data?.map(r => r.role as AppRole) || [];
    const primary = roleOrder.find(r => userRoles.includes(r)) || null;
    setPrimaryRole(primary);
    setLoading(false);
  };

  const hasRole = (role: AppRole): boolean => {
    return roles.some(r => r.role === role);
  };

  const isAdmin = (): boolean => hasRole('ADMIN');
  const isBusinessOwner = (): boolean => hasRole('BUSINESS_OWNER');
  const isStaff = (): boolean => hasRole('STAFF');
  const isConsumer = (): boolean => hasRole('CONSUMER');

  const addRole = async (role: AppRole) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role });

    if (!error) {
      await fetchRoles();
    }

    return { error };
  };

  return {
    roles,
    primaryRole,
    loading,
    hasRole,
    isAdmin,
    isBusinessOwner,
    isStaff,
    isConsumer,
    addRole,
    refreshRoles: fetchRoles,
  };
}
