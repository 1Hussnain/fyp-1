
/**
 * Update Transaction Hook
 * 
 * Handles updating existing transactions with error handling.
 */

import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/supabase';
import { TransactionUpdate } from '@/types/database';
import { useErrorRecovery } from './useErrorRecovery';

export const useUpdateTransaction = () => {
  const { toast } = useToast();
  const { executeWithRetry } = useErrorRecovery();

  /**
   * Update an existing transaction with error handling
   */
  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
    try {
      console.log('[useUpdateTransaction] Updating transaction:', id);

      const result = await executeWithRetry(
        () => transactionService.update(id, updates),
        'Updating transaction'
      );

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
      console.error('[useUpdateTransaction] Error updating transaction:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  return { updateTransaction };
};
