
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionFetching } from './useTransactionFetching';
import { useTransactionState } from './useTransactionState';
import { supabase } from '@/integrations/supabase/client';
import { TransactionWithCategory } from '@/types/database';

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

  // Simple real-time subscription without external hooks
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`transactions_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('[useTransactionData] Realtime update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newTransaction = payload.new as TransactionWithCategory;
            setTransactions(prev => [newTransaction, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedTransaction = payload.new as TransactionWithCategory;
            setTransactions(prev => prev.map(transaction => 
              transaction.id === updatedTransaction.id ? updatedTransaction : transaction
            ));
          } else if (payload.eventType === 'DELETE') {
            const deletedTransaction = payload.old as TransactionWithCategory;
            setTransactions(prev => prev.filter(transaction => transaction.id !== deletedTransaction.id));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user?.id, setTransactions]);

  return {
    transactions,
    setTransactions,
    loading,
    error,
    refetch: loadTransactions
  };
};
