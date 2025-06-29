
/**
 * Transaction Data Management Hook
 * 
 * Combines transaction fetching and state management with
 * user authentication integration and lifecycle management.
 */

import { useEffect, useRef } from 'react';
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

  const hasFetchedRef = useRef(false);
  const currentUserRef = useRef<string | null>(null);

  /**
   * Load transactions with proper state management
   */
  const loadTransactions = async () => {
    if (!user) {
      updateLoading(false);
      return;
    }

    // Prevent duplicate fetches for the same user
    if (hasFetchedRef.current && currentUserRef.current === user.id) {
      return;
    }

    updateLoading(true);
    updateError(null);

    const result = await fetchTransactions();
    
    if (result.success) {
      setTransactions(result.data);
      updateError(null);
      hasFetchedRef.current = true;
      currentUserRef.current = user.id;
    } else {
      updateError(result.error);
    }
    
    updateLoading(false);
  };

  // Reset state when user changes
  useEffect(() => {
    if (currentUserRef.current !== user?.id) {
      hasFetchedRef.current = false;
      currentUserRef.current = user?.id || null;
      resetState();
    }
  }, [user?.id, resetState]);

  // Initial data fetch when user changes
  useEffect(() => {
    if (user && !hasFetchedRef.current) {
      console.log('[useTransactionData] User changed, fetching transactions');
      loadTransactions();
    }
  }, [user]);

  return {
    transactions,
    setTransactions,
    loading,
    error,
    refetch: loadTransactions
  };
};
