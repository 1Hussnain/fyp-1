
import { supabase } from '@/integrations/supabase/client';
import { Budget, BudgetInsert, BudgetUpdate, ServiceResponse } from '@/types/database';

export const budgetService = {
  async getCurrent(userId: string): Promise<ServiceResponse<Budget | null>> {
    try {
      const currentDate = new Date();
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentDate.getMonth() + 1)
        .eq('year', currentDate.getFullYear())
        .maybeSingle();

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

  async upsert(budget: BudgetInsert): Promise<ServiceResponse<Budget>> {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .upsert(budget)
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

  async update(id: string, updates: BudgetUpdate): Promise<ServiceResponse<Budget>> {
    try {
      const { data, error } = await supabase
        .from('budgets')
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
  }
};
