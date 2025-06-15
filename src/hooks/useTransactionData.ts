
/**
 * Transaction Data Management Hook
 * 
 * Combines transaction fetching and state management with
 * user authentication integration and lifecycle management.
 */

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionFetching } from './useTransactionFetching';
import { useTransactionState } from './useTransactionState';

export const useTransactionData = () => {
  const { user } = useAuth();
  const { fetchTransactions } = useTransactionFetching();
  const {
    transactions,
    loading,
    error,
    setTransactions,
    updateLoading,
    updateError,
    resetState
  } = useTransactionState();

  /**
   * Load transactions with proper state management
   */
  const loadTransactions = async () => {
    if (!user) {
      updateLoading(false);
      return;
    }

    updateLoading(true);
    updateError(null);

    const result = await fetchTransactions();
    
    if (result.success) {
      setTransactions(result.data);
      updateError(null);
    } else {
      updateError(result.error);
    }
    
    updateLoading(false);
  };

  // Initial data fetch when user changes
  useEffect(() => {
    console.log('[useTransactionData] User changed, fetching transactions');
    loadTransactions();
  }, [user]);

  return {
    transactions,
    setTransactions,
    loading,
    error,
    refetch: loadTransactions
  };
};
