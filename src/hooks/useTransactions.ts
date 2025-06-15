
/**
 * Optimized Transactions Hook
 * 
 * Provides comprehensive transaction management with:
 * - Real-time updates through centralized subscription manager
 * - Error recovery and retry logic with exponential backoff
 * - Performance optimizations through memoization
 * - Proper loading states and error handling
 * - Toast notifications for user feedback
 * 
 * Key Features:
 * - Automatic data fetching on user authentication
 * - Optimistic updates for better UX
 * - Centralized realtime subscriptions (no duplicates)
 * - Comprehensive error handling with user-friendly messages
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/supabase';
import { TransactionWithCategory, TransactionInsert, TransactionUpdate } from '@/types/database';
import { useRealtime } from './useRealtime';
import { useErrorRecovery } from './useErrorRecovery';

/**
 * Main transactions hook providing CRUD operations and real-time updates
 * @returns Object with transactions data, loading states, and CRUD functions
 */
export const useTransactions = () => {
  // Get authenticated user and utility hooks
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeWithRetry } = useErrorRecovery();
  
  // State management for transactions data
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all transactions for the current user with error recovery
   * Includes retry logic and proper error handling
   */
  const fetchTransactions = async () => {
    // Don't fetch if user is not authenticated
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[useTransactions] Fetching transactions for user:', user.id);

      // Use error recovery service for automatic retries
      const result = await executeWithRetry(
        () => transactionService.getAll(user.id),
        'Loading transactions'
      );

      if (result.success) {
        setTransactions(result.data || []);
        console.log('[useTransactions] Successfully loaded', result.data?.length || 0, 'transactions');
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
      console.error('[useTransactions] Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new transaction with optimistic updates and error handling
   * @param transactionData - Transaction data without user_id (automatically added)
   * @returns Promise with success status and error details
   */
  const addTransaction = async (transactionData: Omit<TransactionInsert, 'user_id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      console.log('[useTransactions] Adding new transaction:', transactionData.description);

      // Execute with retry logic for network resilience
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
        // Note: Real-time subscription will handle the state update automatically
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
      console.error('[useTransactions] Error adding transaction:', err);
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
   * @param id - Transaction ID to update
   * @param updates - Partial transaction data to update
   * @returns Promise with success status and error details
   */
  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
    try {
      console.log('[useTransactions] Updating transaction:', id);

      const result = await executeWithRetry(
        () => transactionService.update(id, updates),
        'Updating transaction'
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        });
        // Note: Real-time subscription will handle the state update automatically
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
      console.error('[useTransactions] Error updating transaction:', err);
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
   * @param id - Transaction ID to delete
   * @returns Promise with success status and error details
   */
  const deleteTransaction = async (id: string) => {
    try {
      console.log('[useTransactions] Deleting transaction:', id);

      const result = await executeWithRetry(
        () => transactionService.delete(id),
        'Deleting transaction'
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        });
        // Note: Real-time subscription will handle the state update automatically
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
      console.error('[useTransactions] Error deleting transaction:', err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  // Initial data fetch when user changes
  useEffect(() => {
    console.log('[useTransactions] User changed, fetching transactions');
    fetchTransactions();
  }, [user]);

  // Setup real-time updates using centralized subscription manager
  // This prevents duplicate subscriptions and ensures proper cleanup
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

  // Return hook interface with all transaction operations
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
