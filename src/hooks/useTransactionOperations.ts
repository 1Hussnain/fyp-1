
/**
 * Transaction CRUD Operations Hook
 * 
 * Combines all individual transaction operations into a single hook
 * with unified interface for CRUD operations.
 */

import { useAddTransaction } from './useAddTransaction';
import { useUpdateTransaction } from './useUpdateTransaction';
import { useDeleteTransaction } from './useDeleteTransaction';

export const useTransactionOperations = () => {
  const { addTransaction } = useAddTransaction();
  const { updateTransaction } = useUpdateTransaction();
  const { deleteTransaction } = useDeleteTransaction();

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
