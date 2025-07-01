
/**
 * Add Transaction Hook
 * 
 * Handles creating new transactions with optimistic updates and error handling.
 */

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/supabase';
import { TransactionInsert } from '@/types/database';
import { useErrorRecovery } from './useErrorRecovery';

export const useAddTransaction = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeWithRetry } = useErrorRecovery();

  /**
   * Add a new transaction with optimistic updates and error handling
   */
  const addTransaction = async (transactionData: Omit<TransactionInsert, 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      console.log('[useAddTransaction] Adding new transaction:', transactionData.description);

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
      console.error('[useAddTransaction] Error adding transaction:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  return { addTransaction };
};
