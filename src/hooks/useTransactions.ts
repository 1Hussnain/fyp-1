
import { useAuth } from '@/contexts/AuthContext';
import { useTransactionData } from './useTransactionData';
import { useTransactionOperations } from './useTransactionOperations';
import { dataSyncService } from '@/services/realtime/dataSyncService';
import { useEffect } from 'react';

export const useTransactions = () => {
  const { user } = useAuth();
  
  const {
    transactions,
    setTransactions,
    loading,
    error,
    refetch
  } = useTransactionData();

  const {
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactionOperations();

  // Setup centralized real-time synchronization
  useEffect(() => {
    if (!user?.id) return;

    console.log('[useTransactions] Setting up data sync for user:', user.id);

    const unsubscribe = dataSyncService.subscribe(
      'transactions',
      (payload) => {
        console.log('[useTransactions] Received synced transaction data:', payload);
        setTransactions(payload);
      },
      user.id
    );

    return unsubscribe;
  }, [user?.id, setTransactions]);

  // Enhanced CRUD operations with sync
  const handleAddTransaction = async (data: any) => {
    const result = await addTransaction(data);
    if (result && user?.id) {
      // Trigger refetch to get latest data
      await refetch();
    }
    return result;
  };

  const handleUpdateTransaction = async (id: string, updates: any) => {
    const result = await updateTransaction(id, updates);
    if (result && user?.id) {
      await refetch();
    }
    return result;
  };

  const handleDeleteTransaction = async (id: string) => {
    const result = await deleteTransaction(id);
    if (result && user?.id) {
      await refetch();
    }
    return result;
  };

  return {
    transactions,
    loading,
    error,
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,
    refetch
  };
};
