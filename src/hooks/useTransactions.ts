
/**
 * Main Transactions Hook
 * 
 * Combines transaction data management and operations with real-time updates.
 * This is the main hook that components should use for transaction functionality.
 */

import { useAuth } from '@/contexts/AuthContext';
import { useRealtime } from './useRealtime';
import { useTransactionData } from './useTransactionData';
import { useTransactionOperations } from './useTransactionOperations';

/**
 * Main transactions hook providing CRUD operations and real-time updates
 * @returns Object with transactions data, loading states, and CRUD functions
 */
export const useTransactions = () => {
  const { user } = useAuth();
  
  // Get data management functionality
  const {
    transactions,
    setTransactions,
    loading,
    error,
    refetch
  } = useTransactionData();

  // Get CRUD operations
  const {
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactionOperations();

  // Setup real-time updates using centralized subscription manager
  useRealtime(
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
    refetch
  };
};
