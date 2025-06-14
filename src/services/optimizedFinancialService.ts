
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions based on new schema
export type Category = Database['public']['Tables']['categories']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type Budget = Database['public']['Tables']['budgets']['Row'];
export type FinancialGoal = Database['public']['Tables']['financial_goals']['Row'];

export interface TransactionWithCategory extends Transaction {
  categories: Category | null;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
}

// Optimized Financial Service
class OptimizedFinancialService {
  // Categories
  async getCategories(type?: 'income' | 'expense') {
    let query = supabase
      .from('categories')
      .select('*')
      .order('is_system', { ascending: false })
      .order('name');

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    return { data: data || [], error };
  }

  async createCategory(category: Omit<Category, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    return { data, error };
  }

  // Transactions with optimized queries
  async getTransactions(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(*)
      `)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data: data || [], error };
  }

  async getTransactionsByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(*)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    return { data: data || [], error };
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select(`
        *,
        categories(*)
      `)
      .single();

    return { data, error };
  }

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        categories(*)
      `)
      .single();

    return { data, error };
  }

  async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    return { error };
  }

  // Financial Goals
  async getGoals() {
    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .order('deadline', { ascending: true })
      .order('priority', { ascending: false });

    return { data: data || [], error };
  }

  async createGoal(goal: Omit<FinancialGoal, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('financial_goals')
      .insert(goal)
      .select()
      .single();

    return { data, error };
  }

  async updateGoal(id: string, updates: Partial<FinancialGoal>) {
    const { data, error } = await supabase
      .from('financial_goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async deleteGoal(id: string) {
    const { error } = await supabase
      .from('financial_goals')
      .delete()
      .eq('id', id);

    return { error };
  }

  // Budgets
  async getCurrentMonthBudgets() {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        categories(*)
      `)
      .eq('month', month)
      .eq('year', year);

    return { data: data || [], error };
  }

  async createOrUpdateBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('budgets')
      .upsert({ 
        ...budget,
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        categories(*)
      `)
      .single();

    return { data, error };
  }

  // Financial Summary using materialized view
  async getFinancialSummary(month?: number, year?: number): Promise<{ data: FinancialSummary | null, error: any }> {
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    // Get summary from materialized view
    const { data, error } = await supabase
      .from('user_financial_summary')
      .select('*')
      .eq('month', `${targetYear}-${targetMonth.toString().padStart(2, '0')}-01`)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { data: null, error };
    }

    // If no data in materialized view, calculate directly
    if (!data) {
      const startDate = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-01`;
      const endDate = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0];

      const { data: transactions, error: transError } = await this.getTransactionsByDateRange(startDate, endDate);
      
      if (transError) {
        return { data: null, error: transError };
      }

      const summary: FinancialSummary = {
        totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0),
        totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0),
        netIncome: 0,
        transactionCount: transactions.length
      };

      summary.netIncome = summary.totalIncome - summary.totalExpenses;
      return { data: summary, error: null };
    }

    const summary: FinancialSummary = {
      totalIncome: Number(data.total_income || 0),
      totalExpenses: Number(data.total_expenses || 0),
      netIncome: Number(data.total_income || 0) - Number(data.total_expenses || 0),
      transactionCount: Number(data.transaction_count || 0)
    };

    return { data: summary, error: null };
  }

  // Category spending analysis
  async getCategorySpending(month?: number, year?: number) {
    const currentDate = new Date();
    const targetMonth = month || currentDate.getMonth() + 1;
    const targetYear = year || currentDate.getFullYear();

    const startDate = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-01`;
    const endDate = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        amount,
        type,
        categories(name, color, icon)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('type', 'expense');

    if (error) return { data: [], error };

    // Group by category
    const categoryMap = new Map();
    data?.forEach(transaction => {
      const categoryName = transaction.categories?.name || 'Uncategorized';
      const current = categoryMap.get(categoryName) || {
        category: categoryName,
        amount: 0,
        color: transaction.categories?.color || '#6B7280',
        icon: transaction.categories?.icon || 'DollarSign'
      };
      current.amount += Number(transaction.amount);
      categoryMap.set(categoryName, current);
    });

    const categoryData = Array.from(categoryMap.values())
      .sort((a, b) => b.amount - a.amount);

    return { data: categoryData, error: null };
  }
}

export const optimizedFinancialService = new OptimizedFinancialService();
