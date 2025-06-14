
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { optimizedFinancialService, TransactionWithCategory, FinancialGoal, Category, FinancialSummary } from '@/services/optimizedFinancialService';

export const useOptimizedFinancial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [categorySpending, setCategorySpending] = useState<any[]>([]);

  // Load all data
  const loadData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load data in parallel for better performance
      const [
        transactionsResult,
        goalsResult,
        categoriesResult,
        summaryResult,
        categorySpendingResult
      ] = await Promise.all([
        optimizedFinancialService.getTransactions(100),
        optimizedFinancialService.getGoals(),
        optimizedFinancialService.getCategories(),
        optimizedFinancialService.getFinancialSummary(),
        optimizedFinancialService.getCategorySpending()
      ]);

      if (transactionsResult.error) {
        console.error('Error loading transactions:', transactionsResult.error);
        toast({ title: "Error", description: "Failed to load transactions", variant: "destructive" });
      } else {
        setTransactions(transactionsResult.data);
      }

      if (goalsResult.error) {
        console.error('Error loading goals:', goalsResult.error);
        toast({ title: "Error", description: "Failed to load goals", variant: "destructive" });
      } else {
        setGoals(goalsResult.data);
      }

      if (categoriesResult.error) {
        console.error('Error loading categories:', categoriesResult.error);
        toast({ title: "Error", description: "Failed to load categories", variant: "destructive" });
      } else {
        setCategories(categoriesResult.data);
      }

      if (summaryResult.error) {
        console.error('Error loading summary:', summaryResult.error);
      } else {
        setSummary(summaryResult.data);
      }

      if (categorySpendingResult.error) {
        console.error('Error loading category spending:', categorySpendingResult.error);
      } else {
        setCategorySpending(categorySpendingResult.data);
      }

    } catch (error) {
      console.error('Error loading financial data:', error);
      toast({ title: "Error", description: "Failed to load financial data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Load data on mount and user change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Transaction operations
  const addTransaction = async (transactionData: {
    amount: number;
    type: 'income' | 'expense';
    category_id: string;
    description?: string;
    date?: string;
  }) => {
    try {
      const { data, error } = await optimizedFinancialService.createTransaction({
        ...transactionData,
        user_id: user!.id,
        date: transactionData.date || new Date().toISOString().split('T')[0]
      });

      if (error) {
        toast({ title: "Error", description: "Failed to add transaction", variant: "destructive" });
        return false;
      }

      setTransactions(prev => [data, ...prev]);
      
      // Refresh summary
      const summaryResult = await optimizedFinancialService.getFinancialSummary();
      if (summaryResult.data) setSummary(summaryResult.data);

      toast({ title: "Success", description: "Transaction added successfully" });
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({ title: "Error", description: "Failed to add transaction", variant: "destructive" });
      return false;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<TransactionWithCategory>) => {
    try {
      const { data, error } = await optimizedFinancialService.updateTransaction(id, updates);

      if (error) {
        toast({ title: "Error", description: "Failed to update transaction", variant: "destructive" });
        return false;
      }

      setTransactions(prev => prev.map(t => t.id === id ? data : t));
      
      // Refresh summary
      const summaryResult = await optimizedFinancialService.getFinancialSummary();
      if (summaryResult.data) setSummary(summaryResult.data);

      toast({ title: "Success", description: "Transaction updated successfully" });
      return true;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({ title: "Error", description: "Failed to update transaction", variant: "destructive" });
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await optimizedFinancialService.deleteTransaction(id);

      if (error) {
        toast({ title: "Error", description: "Failed to delete transaction", variant: "destructive" });
        return false;
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Refresh summary
      const summaryResult = await optimizedFinancialService.getFinancialSummary();
      if (summaryResult.data) setSummary(summaryResult.data);

      toast({ title: "Success", description: "Transaction deleted successfully" });
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({ title: "Error", description: "Failed to delete transaction", variant: "destructive" });
      return false;
    }
  };

  // Goal operations
  const addGoal = async (goalData: Omit<FinancialGoal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_completed'>) => {
    try {
      const { data, error } = await optimizedFinancialService.createGoal({
        ...goalData,
        user_id: user!.id,
        is_completed: false
      });

      if (error) {
        toast({ title: "Error", description: "Failed to create goal", variant: "destructive" });
        return false;
      }

      setGoals(prev => [...prev, data]);
      toast({ title: "Success", description: "Goal created successfully" });
      return true;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({ title: "Error", description: "Failed to create goal", variant: "destructive" });
      return false;
    }
  };

  const updateGoal = async (id: string, updates: Partial<FinancialGoal>) => {
    try {
      const { data, error } = await optimizedFinancialService.updateGoal(id, updates);

      if (error) {
        toast({ title: "Error", description: "Failed to update goal", variant: "destructive" });
        return false;
      }

      setGoals(prev => prev.map(g => g.id === id ? data : g));
      toast({ title: "Success", description: "Goal updated successfully" });
      return true;
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({ title: "Error", description: "Failed to update goal", variant: "destructive" });
      return false;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await optimizedFinancialService.deleteGoal(id);

      if (error) {
        toast({ title: "Error", description: "Failed to delete goal", variant: "destructive" });
        return false;
      }

      setGoals(prev => prev.filter(g => g.id !== id));
      toast({ title: "Success", description: "Goal deleted successfully" });
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({ title: "Error", description: "Failed to delete goal", variant: "destructive" });
      return false;
    }
  };

  // Category operations
  const addCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'is_system'>) => {
    try {
      const { data, error } = await optimizedFinancialService.createCategory({
        ...categoryData,
        user_id: user!.id,
        is_system: false
      });

      if (error) {
        toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
        return false;
      }

      setCategories(prev => [...prev, data]);
      toast({ title: "Success", description: "Category created successfully" });
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
      return false;
    }
  };

  // Computed values
  const income = summary?.totalIncome || 0;
  const expenses = summary?.totalExpenses || 0;
  const netIncome = summary?.netIncome || 0;
  const transactionCount = summary?.transactionCount || 0;

  const activeGoals = goals.filter(goal => !goal.is_completed);
  const completedGoals = goals.filter(goal => goal.is_completed);

  return {
    // Data
    transactions,
    goals,
    categories,
    summary,
    categorySpending,
    
    // Computed values
    income,
    expenses,
    netIncome,
    transactionCount,
    activeGoals,
    completedGoals,
    
    // State
    loading,
    
    // Operations
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    addCategory,
    loadData
  };
};
