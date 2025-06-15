
/**
 * Admin Analytics Service
 * 
 * Provides system-wide analytics and reporting functionality including:
 * - System-wide financial metrics
 * - Activity logs retrieval
 * - Data aggregation and insights
 */

import { supabase } from '@/integrations/supabase/client';
import { ServiceResponse, AdminActivity } from '@/types/database';

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
