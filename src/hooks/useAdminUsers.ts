
/**
 * Admin Users Management Hook
 */

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { adminUserService } from '@/services/supabase/admin';
import { UserWithRoles, AppRole } from '@/types/database';

export const useAdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
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
