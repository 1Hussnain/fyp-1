
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type definitions
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type Budget = Database['public']['Tables']['budgets']['Row'];
export type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
export type FinancialGoal = Database['public']['Tables']['financial_goals']['Row'];
export type FinancialGoalInsert = Database['public']['Tables']['financial_goals']['Insert'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

// Helper function to get current user
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Transaction functions
export const createTransaction = async (transaction: Omit<TransactionInsert, 'user_id'>) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: 'User not authenticated' };

  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...transaction, user_id: user.id })
    .select()
    .single();

  return { data, error };
};

export const getTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  return { data, error };
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const deleteTransaction = async (id: string) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  return { error };
};

// Budget functions
export const createOrUpdateBudget = async (budget: Omit<BudgetInsert, 'user_id'>) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: 'User not authenticated' };

  const { data, error } = await supabase
    .from('budgets')
    .upsert({ 
      ...budget, 
      user_id: user.id,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  return { data, error };
};

export const getCurrentBudget = async () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('month', month)
    .eq('year', year)
    .maybeSingle();

  return { data, error };
};

export const updateBudgetSpent = async (spent: number) => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { data, error } = await supabase
    .from('budgets')
    .update({ 
      current_spent: spent,
      updated_at: new Date().toISOString()
    })
    .eq('month', month)
    .eq('year', year)
    .select()
    .single();

  return { data, error };
};

// Financial Goals functions
export const createGoal = async (goal: Omit<FinancialGoalInsert, 'user_id'>) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: 'User not authenticated' };

  const { data, error } = await supabase
    .from('financial_goals')
    .insert({ ...goal, user_id: user.id })
    .select()
    .single();

  return { data, error };
};

export const getGoals = async () => {
  const { data, error } = await supabase
    .from('financial_goals')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

export const updateGoal = async (id: string, updates: Partial<FinancialGoal>) => {
  const { data, error } = await supabase
    .from('financial_goals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const deleteGoal = async (id: string) => {
  const { error } = await supabase
    .from('financial_goals')
    .delete()
    .eq('id', id);

  return { error };
};

export const addSavingsToGoal = async (id: string, amount: number) => {
  // First get the current goal
  const { data: goal, error: fetchError } = await supabase
    .from('financial_goals')
    .select('saved_amount')
    .eq('id', id)
    .single();

  if (fetchError || !goal) return { data: null, error: fetchError };

  const newSavedAmount = parseFloat(goal.saved_amount.toString()) + amount;

  const { data, error } = await supabase
    .from('financial_goals')
    .update({ 
      saved_amount: newSavedAmount,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

// Categories functions
export const getCategories = async (type?: 'income' | 'expense') => {
  let query = supabase
    .from('categories')
    .select('*')
    .order('name');

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  return { data, error };
};

export const createCategory = async (category: Omit<CategoryInsert, 'user_id'>) => {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: 'User not authenticated' };

  const { data, error } = await supabase
    .from('categories')
    .insert({ ...category, user_id: user.id, is_system: false })
    .select()
    .single();

  return { data, error };
};

// Data migration functions
export const migrateLocalStorageToDatabase = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Starting migration from localStorage to database...');
    
    // Migrate transactions from useTransactions localStorage
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      const localTransactions = JSON.parse(storedTransactions);
      console.log(`Found ${localTransactions.length} transactions to migrate`);
      
      for (const transaction of localTransactions) {
        await createTransaction({
          type: transaction.type,
          amount: parseFloat(transaction.amount),
          description: transaction.description,
          date: new Date(transaction.date).toISOString().split('T')[0]
        });
      }
      
      localStorage.removeItem('transactions');
      console.log('Transactions migrated successfully');
    }

    // Migrate budget data from useBudgetTracker localStorage
    const storedBudgetTransactions = localStorage.getItem('budget-transactions');
    const storedBudgetLimit = localStorage.getItem('budget-limit');
    
    if (storedBudgetTransactions) {
      const budgetTransactions = JSON.parse(storedBudgetTransactions);
      console.log(`Found ${budgetTransactions.length} budget transactions to migrate`);
      
      for (const transaction of budgetTransactions) {
        await createTransaction({
          type: transaction.type,
          amount: parseFloat(transaction.amount),
          description: transaction.description,
          date: new Date(transaction.date).toISOString().split('T')[0]
        });
      }
      
      localStorage.removeItem('budget-transactions');
      console.log('Budget transactions migrated successfully');
    }

    if (storedBudgetLimit) {
      const budgetLimit = parseFloat(storedBudgetLimit);
      const currentDate = new Date();
      
      await createOrUpdateBudget({
        monthly_limit: budgetLimit,
        current_spent: 0,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
      });
      
      localStorage.removeItem('budget-limit');
      console.log('Budget limit migrated successfully');
    }

    // Migrate goals from useGoals localStorage
    const storedGoals = localStorage.getItem('financialGoals');
    if (storedGoals) {
      const localGoals = JSON.parse(storedGoals);
      console.log(`Found ${localGoals.length} goals to migrate`);
      
      for (const goal of localGoals) {
        await createGoal({
          name: goal.name,
          target_amount: parseFloat(goal.target),
          saved_amount: parseFloat(goal.saved),
          deadline: goal.deadline,
          goal_type: goal.type || 'other'
        });
      }
      
      localStorage.removeItem('financialGoals');
      console.log('Goals migrated successfully');
    }

    console.log('Migration completed successfully!');
    return { success: true, error: null };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
};
