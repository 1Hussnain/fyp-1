
/**
 * Transaction Data Management Hook
 * 
 * Handles fetching and state management for transactions data
 * with error recovery and loading states.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/supabase';
import { TransactionWithCategory } from '@/types/database';
import { useErrorRecovery } from './useErrorRecovery';

export const useTransactionData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeWithRetry } = useErrorRecovery();
  
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all transactions for the current user with error recovery
   */
  const fetchTransactions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[useTransactionData] Fetching transactions for user:', user.id);

      const result = await executeWithRetry(
        () => transactionService.getAll(user.id),
        'Loading transactions'
      );

      if (result.success) {
        setTransactions(result.data || []);
        console.log('[useTransactionData] Successfully loaded', result.data?.length || 0, 'transactions');
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
      console.error('[useTransactionData] Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch when user changes
  useEffect(() => {
    console.log('[useTransactionData] User changed, fetching transactions');
    fetchTransactions();
  }, [user]);

  return {
    transactions,
    setTransactions,
    loading,
    error,
    refetch: fetchTransactions
  };
};
