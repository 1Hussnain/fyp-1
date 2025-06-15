
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/supabase';
import { TransactionWithCategory, TransactionInsert, TransactionUpdate } from '@/types/database';
import { useRealtime } from './useRealtime';

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);
    const result = await transactionService.getAll(user.id);

    if (result.success) {
      setTransactions(result.data || []);
    } else {
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const addTransaction = async (transactionData: Omit<TransactionInsert, 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const result = await transactionService.create({
      ...transactionData,
      user_id: user.id
    });

    if (result.success) {
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add transaction",
        variant: "destructive",
      });
    }
    return result;
  };

  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
    const result = await transactionService.update(id, updates);

    if (result.success) {
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update transaction",
        variant: "destructive",
      });
    }
    return result;
  };

  const deleteTransaction = async (id: string) => {
    const result = await transactionService.delete(id);

    if (result.success) {
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete transaction",
        variant: "destructive",
      });
    }
    return result;
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Add realtime updates
  useRealtime<TransactionWithCategory>("transactions", user?.id || null, setTransactions);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};
