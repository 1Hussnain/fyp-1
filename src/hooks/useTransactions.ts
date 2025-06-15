
/**
 * Optimized Transactions Hook
 * 
 * Provides transaction management with:
 * - Real-time updates with proper subscription handling
 * - Error recovery and retry logic
 * - Performance optimizations
 * - Proper loading states
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/supabase';
import { TransactionWithCategory, TransactionInsert, TransactionUpdate } from '@/types/database';
import { useRealtime } from './useRealtime';
import { useErrorRecovery } from './useErrorRecovery';

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeWithRetry } = useErrorRecovery();
  
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch transactions with error recovery
   */
  const fetchTransactions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await executeWithRetry(
        () => transactionService.getAll(user.id),
        'Loading transactions'
      );

      if (result.success) {
        setTransactions(result.data || []);
      } else {
        setError(result.error || 'Failed to load transactions');
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add new transaction with optimistic updates
   */
  const addTransaction = async (transactionData: Omit<TransactionInsert, 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const result = await executeWithRetry(
        () => transactionService.create({
          ...transactionData,
          user_id: user.id
        }),
        'Adding transaction'
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Transaction added successfully",
        });
        // Real-time will handle the state update
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

  /**
   * Update transaction with optimistic updates
   */
  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
    try {
      const result = await executeWithRetry(
        () => transactionService.update(id, updates),
        'Updating transaction'
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        });
        // Real-time will handle the state update
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

  /**
   * Delete transaction with optimistic updates
   */
  const deleteTransaction = async (id: string) => {
    try {
      const result = await executeWithRetry(
        () => transactionService.delete(id),
        'Deleting transaction'
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        });
        // Real-time will handle the state update
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

  // Initial data fetch
  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Setup real-time updates with optimized subscription
  useRealtime<TransactionWithCategory>(
    "transactions", 
    user?.id || null, 
    setTransactions,
    {
      enableDebounce: true,
      debounceMs: 200,
      enableRetry: true,
      maxRetries: 3
    }
  );

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};
