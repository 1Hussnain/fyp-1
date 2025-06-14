
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TransactionWithCategory } from '@/services/optimizedFinancialService';

interface TransactionFilter {
  type?: 'income' | 'expense';
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [allTransactions, setAllTransactions] = useState<TransactionWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TransactionFilter>({});

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    applyFilter();
  }, [allTransactions, filter]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories(*)
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      const transactionsWithCategory = data.map(transaction => ({
        ...transaction,
        categories: transaction.categories
      })) as TransactionWithCategory[];

      setAllTransactions(transactionsWithCategory);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...allTransactions];

    if (filter.type) {
      filtered = filtered.filter(t => t.type === filter.type);
    }

    if (filter.category) {
      filtered = filtered.filter(t => t.categories?.name === filter.category);
    }

    if (filter.dateRange) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        const startDate = new Date(filter.dateRange!.start);
        const endDate = new Date(filter.dateRange!.end);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    setTransactions(filtered);
  };

  const addTransaction = async (transactionData: {
    type: 'income' | 'expense';
    category_id: string | null;
    amount: number;
    description?: string;
    date: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user?.id,
          ...transactionData
        }])
        .select(`
          *,
          categories(*)
        `)
        .single();

      if (error) throw error;

      const newTransaction = {
        ...data,
        categories: data.categories
      } as TransactionWithCategory;

      setAllTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Transaction Added",
        description: `${transactionData.type === 'income' ? 'Income' : 'Expense'} of $${transactionData.amount} added`,
      });

      return { success: true, data: newTransaction };
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const editTransaction = async (id: string, updates: Partial<TransactionWithCategory>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          categories(*)
        `)
        .single();

      if (error) throw error;

      const updatedTransaction = {
        ...data,
        categories: data.categories
      } as TransactionWithCategory;

      setAllTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );

      toast({
        title: "Transaction Updated",
        description: "Transaction has been successfully updated",
      });

      return { success: true, data: updatedTransaction };
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const removeTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAllTransactions(prev => prev.filter(t => t.id !== id));

      toast({
        title: "Transaction Deleted",
        description: "Transaction has been successfully deleted",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const resetFilters = () => {
    setFilter({});
  };

  return {
    transactions,
    allTransactions,
    loading,
    filter,
    addTransaction,
    editTransaction,
    removeTransaction,
    setFilter,
    resetFilters,
    refetch: fetchTransactions
  };
};
