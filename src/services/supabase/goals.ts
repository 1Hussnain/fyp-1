
import { supabase } from '@/integrations/supabase/client';
import { FinancialGoal, FinancialGoalInsert, FinancialGoalUpdate, ServiceResponse } from '@/types/database';

export const goalService = {
  async getAll(userId: string): Promise<ServiceResponse<FinancialGoal[]>> {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async create(goal: FinancialGoalInsert): Promise<ServiceResponse<FinancialGoal>> {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert(goal)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async update(id: string, updates: FinancialGoalUpdate): Promise<ServiceResponse<FinancialGoal>> {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async delete(id: string): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};
