
/**
 * Transaction Fetching Hook
 * 
 * Handles the actual fetching of transactions from the database
 * with error recovery and logging.
 */

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/supabase';
import { useErrorRecovery } from './useErrorRecovery';

export const useTransactionFetching = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeWithRetry } = useErrorRecovery();

  /**
   * Fetch all transactions for the current user with error recovery
   */
  const fetchTransactions = async () => {
    if (!user) {
      return { success: false, data: [], error: 'No user authenticated' };
    }

    try {
      console.log('[useTransactionFetching] Fetching transactions for user:', user.id);

      const result = await executeWithRetry(
        () => transactionService.getAll(user.id),
        'Loading transactions'
      );

      if (result.success) {
        console.log('[useTransactionFetching] Successfully loaded', result.data?.length || 0, 'transactions');
        return { success: true, data: result.data || [], error: null };
      } else {
        const errorMessage = result.error || 'Failed to load transactions';
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
        return { success: false, data: [], error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[useTransactionFetching] Error fetching transactions:', err);
      return { success: false, data: [], error: errorMessage };
    }
  };

  return {
    fetchTransactions
  };
};
