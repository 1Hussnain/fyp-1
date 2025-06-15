
/**
 * Transaction CRUD Operations Hook
 * 
 * Provides create, update, and delete operations for transactions
 * with error handling and toast notifications.
 */

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/supabase';
import { TransactionInsert, TransactionUpdate } from '@/types/database';
import { useErrorRecovery } from './useErrorRecovery';

export const useTransactionOperations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeWithRetry } = useErrorRecovery();

  /**
   * Add a new transaction with optimistic updates and error handling
   */
  const addTransaction = async (transactionData: Omit<TransactionInsert, 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      console.log('[useTransactionOperations] Adding new transaction:', transactionData.description);

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
      console.error('[useTransactionOperations] Error adding transaction:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Update an existing transaction with error handling
   */
  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
    try {
      console.log('[useTransactionOperations] Updating transaction:', id);

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
      console.error('[useTransactionOperations] Error updating transaction:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Delete a transaction with confirmation and error handling
   */
  const deleteTransaction = async (id: string) => {
    try {
      console.log('[useTransactionOperations] Deleting transaction:', id);

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
      console.error('[useTransactionOperations] Error deleting transaction:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
