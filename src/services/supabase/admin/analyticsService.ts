
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
      // Get basic user count
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, created_at');

      if (profilesError) throw profilesError;

      // Get transaction data
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('amount, type, created_at');

      if (transactionsError) throw transactionsError;

      // Get goals data
      const { data: goals, error: goalsError } = await supabase
        .from('financial_goals')
        .select('is_completed, created_at');

      if (goalsError) throw goalsError;

      // Calculate system-wide metrics
      const totalUsers = profiles?.length || 0;
      const totalTransactions = transactions?.length || 0;
      const totalIncome = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const totalExpenses = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const totalGoals = goals?.length || 0;
      const completedGoals = goals?.filter(g => g.is_completed).length || 0;

      const analytics = {
        totalUsers,
        totalTransactions,
        totalIncome,
        totalExpenses,
        totalGoals,
        completedGoals,
        activeUsers: totalUsers // Simplified for now
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
