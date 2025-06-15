
/**
 * Admin Services Module
 * 
 * Provides admin-specific database operations including:
 * - User management and role assignment
 * - System analytics and reporting
 * - Activity logging and audit trails
 * - Cross-user data access
 */

import { supabase } from '@/integrations/supabase/client';
import { ServiceResponse, UserAnalytics, UserWithRoles, AdminActivity, AppRole } from '@/types/database';

/**
 * Admin User Management Service
 */
export const adminUserService = {
  /**
   * Get all users with their roles and analytics
   */
  async getAllUsers(): Promise<ServiceResponse<UserWithRoles[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role,
            assigned_at,
            assigned_by
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (err) {
      console.error('[adminUserService] Error fetching users:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch users' 
      };
    }
  },

  /**
   * Get user analytics data
   */
  async getUserAnalytics(): Promise<ServiceResponse<UserAnalytics[]>> {
    try {
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .order('user_created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
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
      await this.logActivity('role_assigned', 'user', userId, { role });

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
      await this.logActivity('role_removed', 'user', userId, { role });

      return { success: true };
    } catch (err) {
      console.error('[adminUserService] Error removing role:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to remove role' 
      };
    }
  },

  /**
   * Log admin activity
   */
  async logActivity(
    actionType: string, 
    targetType?: string, 
    targetId?: string, 
    details?: any
  ): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase.rpc('log_admin_activity', {
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        details: details ? JSON.stringify(details) : null
      });

      if (error) throw error;

      return { success: true };
    } catch (err) {
      console.error('[adminUserService] Error logging activity:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to log activity' 
      };
    }
  }
};

/**
 * Admin Analytics Service
 */
export const adminAnalyticsService = {
  /**
   * Get system-wide financial analytics
   */
  async getSystemAnalytics(): Promise<ServiceResponse<any>> {
    try {
      // Refresh the materialized view first
      await supabase.rpc('refresh_user_analytics');

      const { data, error } = await supabase
        .from('user_analytics')
        .select('*');

      if (error) throw error;

      // Calculate system-wide metrics
      const analytics = data?.reduce((acc, user) => ({
        totalUsers: acc.totalUsers + 1,
        totalTransactions: acc.totalTransactions + (user.total_transactions || 0),
        totalIncome: acc.totalIncome + (user.total_income || 0),
        totalExpenses: acc.totalExpenses + (user.total_expenses || 0),
        totalGoals: acc.totalGoals + (user.total_goals || 0),
        completedGoals: acc.completedGoals + (user.completed_goals || 0),
        activeUsers: user.last_transaction_date ? acc.activeUsers + 1 : acc.activeUsers
      }), {
        totalUsers: 0,
        totalTransactions: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalGoals: 0,
        completedGoals: 0,
        activeUsers: 0
      }) || {
        totalUsers: 0,
        totalTransactions: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalGoals: 0,
        completedGoals: 0,
        activeUsers: 0
      };

      return { success: true, data: analytics };
    } catch (err) {
      console.error('[adminAnalyticsService] Error fetching system analytics:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch system analytics' 
      };
    }
  },

  /**
   * Get admin activity logs
   */
  async getActivityLogs(limit = 100): Promise<ServiceResponse<AdminActivity[]>> {
    try {
      const { data, error } = await supabase
        .from('admin_activities')
        .select(`
          *,
          profiles!admin_id (
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (err) {
      console.error('[adminAnalyticsService] Error fetching activity logs:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to fetch activity logs' 
      };
    }
  }
};
