
/**
 * Transaction State Management Hook
 * 
 * Manages the local state for transactions data including
 * loading states and error handling.
 */

import { useState } from 'react';
import { TransactionWithCategory } from '@/types/database';

export const useTransactionState = () => {
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update transactions state
   */
  const updateTransactions = (newTransactions: TransactionWithCategory[]) => {
    setTransactions(newTransactions);
  };

  /**
   * Set loading state
   */
  const updateLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  /**
   * Set error state
   */
  const updateError = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  /**
   * Reset all state to initial values
   */
  const resetState = () => {
    setTransactions([]);
    setLoading(true);
    setError(null);
  };

  return {
    transactions,
    loading,
    error,
    setTransactions,
    updateTransactions,
    updateLoading,
    updateError,
    resetState
  };
};
