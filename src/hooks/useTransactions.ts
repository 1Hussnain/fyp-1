
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/supabase';
import { TransactionWithCategory, TransactionInsert, TransactionUpdate } from '@/types/database';
import { useCleanRealtime } from './useCleanRealtime';

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await transactionService.getAll(user.id);

      if (result.success) {
        setTransactions(result.data || []);
      } else {
        setError(result.error || 'Failed to load transactions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    setTransactions(prev => {
      switch (eventType) {
        case 'INSERT':
          const newTransaction = newRecord as TransactionWithCategory;
          return [newTransaction, ...prev];
        case 'UPDATE':
          const updatedTransaction = newRecord as TransactionWithCategory;
          return prev.map(transaction => 
            transaction.id === updatedTransaction.id ? updatedTransaction : transaction
          );
        case 'DELETE':
          const deletedTransaction = oldRecord as TransactionWithCategory;
          return prev.filter(transaction => transaction.id !== deletedTransaction.id);
        default:
          return prev;
      }
    });
  }, []);

  // Set up real-time subscription
  useCleanRealtime('transactions', user?.id || null, handleRealtimeUpdate);

  // CRUD operations
  const addTransaction = async (transactionData: Omit<TransactionInsert, 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add transaction';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
    try {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const refetch = fetchTransactions;

  // Initial data fetch
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch
  };
};
