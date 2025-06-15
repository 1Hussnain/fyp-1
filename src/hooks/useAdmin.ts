
/**
 * Admin Management Hook
 * 
 * Provides admin-specific functionality including:
 * - Admin role checking and validation
 * - User management operations
 * - Activity logging and audit trails
 * - System analytics access
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { adminUserService, adminAnalyticsService } from '@/services/supabase/admin';
import { UserWithRoles, UserAnalytics, AdminActivity, AppRole } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

export const useAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data || false);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return {
    isAdmin,
    loading,
    ...adminUserService,
    ...adminAnalyticsService
  };
};

/**
 * Admin Users Management Hook
 */
export const useAdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [analytics, setAnalytics] = useState<UserAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersResult, analyticsResult] = await Promise.all([
        adminUserService.getAllUsers(),
        adminUserService.getUserAnalytics()
      ]);

      if (usersResult.success && usersResult.data) {
        setUsers(usersResult.data);
      } else {
        setError(usersResult.error || 'Failed to load users');
      }

      if (analyticsResult.success && analyticsResult.data) {
        setAnalytics(analyticsResult.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, role: AppRole) => {
    try {
      const result = await adminUserService.assignRole(userId, role);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Role ${role} assigned successfully`,
        });
        await loadUsers(); // Refresh the users list
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to assign role",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign role';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const removeRole = async (userId: string, role: AppRole) => {
    try {
      const result = await adminUserService.removeRole(userId, role);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Role ${role} removed successfully`,
        });
        await loadUsers(); // Refresh the users list
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to remove role",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove role';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    analytics,
    loading,
    error,
    assignRole,
    removeRole,
    refresh: loadUsers
  };
};

/**
 * Admin Analytics Hook
 */
export const useAdminAnalytics = () => {
  const [systemAnalytics, setSystemAnalytics] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const [analyticsResult, logsResult] = await Promise.all([
        adminAnalyticsService.getSystemAnalytics(),
        adminAnalyticsService.getActivityLogs()
      ]);

      if (analyticsResult.success && analyticsResult.data) {
        setSystemAnalytics(analyticsResult.data);
      } else {
        setError(analyticsResult.error || 'Failed to load analytics');
      }

      if (logsResult.success && logsResult.data) {
        setActivityLogs(logsResult.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return {
    systemAnalytics,
    activityLogs,
    loading,
    error,
    refresh: loadAnalytics
  };
};
