
/**
 * Admin User Management Service
 * 
 * Provides admin-specific user operations including:
 * - User retrieval with roles
 * - Role assignment and removal
 * - User analytics access
 */

import { supabase } from '@/integrations/supabase/client';
import { ServiceResponse, UserWithRoles, AppRole } from '@/types/database';
import { logAdminActivity } from './activityService';

export const adminUserService = {
  /**
   * Get all users with their roles and analytics
   */
  async getAllUsers(): Promise<ServiceResponse<UserWithRoles[]>> {
    try {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        ...profile,
        user_roles: (userRoles || []).filter(role => role.user_id === profile.id)
      }));

      return { success: true, data: usersWithRoles };
    } catch (err) {
      console.error('[adminUserService] Error fetching users:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch users' 
      };
    }
  },

  /**
   * Get user analytics data (simplified)
   */
  async getUserAnalytics(): Promise<ServiceResponse<any[]>> {
    try {
      // Get basic user data with some analytics
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, created_at');

      if (profilesError) throw profilesError;

      // For now, return simplified analytics
      const analytics = (profiles || []).map(profile => ({
        user_id: profile.id,
        email: profile.email,
        user_created_at: profile.created_at,
        total_transactions: 0, // Could be calculated if needed
        total_income: 0,
        total_expenses: 0,
        total_goals: 0,
        completed_goals: 0
      }));

      return { success: true, data: analytics };
    } catch (err) {
      console.error('[adminUserService] Error fetching user analytics:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch user analytics' 
      };
    }
  },

  /**
   * Assign role to user
   */
  async assignRole(userId: string, role: AppRole): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role,
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      // Log the admin activity
      await logAdminActivity('role_assigned', 'user', userId, { role });

      return { success: true };
    } catch (err) {
      console.error('[adminUserService] Error assigning role:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to assign role' 
      };
    }
  },

  /**
   * Remove role from user
   */
  async removeRole(userId: string, role: AppRole): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      // Log the admin activity
      await logAdminActivity('role_removed', 'user', userId, { role });

      return { success: true };
    } catch (err) {
      console.error('[adminUserService] Error removing role:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to remove role' 
      };
    }
  }
};
