
import { supabase } from '@/integrations/supabase/client';
import { TransactionInsert, TransactionUpdate, TransactionWithCategory, ServiceResponse } from '@/types/database';

export const transactionService = {
  async getAll(userId: string): Promise<ServiceResponse<TransactionWithCategory[]>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (*)
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false });

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

  async create(transaction: TransactionInsert): Promise<ServiceResponse<TransactionWithCategory>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select(`
          *,
          categories (*)
        `)
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

  async update(id: string, updates: TransactionUpdate): Promise<ServiceResponse<TransactionWithCategory>> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          categories (*)
        `)
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
        .from('transactions')
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
