
/**
 * Delete Transaction Hook
 * 
 * Handles deleting transactions with confirmation and error handling.
 */

import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/supabase';
import { useErrorRecovery } from './useErrorRecovery';

export const useDeleteTransaction = () => {
  const { toast } = useToast();
  const { executeWithRetry } = useErrorRecovery();

  /**
   * Delete a transaction with confirmation and error handling
   */
  const deleteTransaction = async (id: string) => {
    try {
      console.log('[useDeleteTransaction] Deleting transaction:', id);

      const result = await executeWithRetry(
        () => transactionService.delete(id),
        'Deleting transaction'
      );

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
      console.error('[useDeleteTransaction] Error deleting transaction:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  return { deleteTransaction };
};
