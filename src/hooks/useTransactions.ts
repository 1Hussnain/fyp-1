
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

  // Handle real-time updates
  const handleRealtimeUpdate = (payload: any) => {
    console.log('[useTransactions] Realtime update:', payload);
    
    if (payload.eventType === 'INSERT') {
      setTransactions(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setTransactions(prev => prev.map(transaction => 
        transaction.id === payload.new.id ? payload.new : transaction
      ));
    } else if (payload.eventType === 'DELETE') {
      setTransactions(prev => prev.filter(transaction => transaction.id !== payload.old.id));
    }
  };

  // Setup real-time updates
  useRealtime("transactions", user?.id || null, handleRealtimeUpdate);

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
