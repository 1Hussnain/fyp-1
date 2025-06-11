
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { transactionService, FormattedTransaction } from "@/services/transactionService";
import { useTransactionOperations } from "./useTransactionOperations";
import { useTransactionFilters } from "./useTransactionFilters";
import { useToast } from "@/hooks/use-toast";

export const useTransactions = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const { addTransaction, editTransaction, removeTransaction } = useTransactionOperations();
  const { filter, filteredTransactions, handleFilterChange, handleResetFilters } = useTransactionFilters(transactions);

  // Load transactions from database
  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await transactionService.getTransactions();
      if (error) {
        console.error('Error loading transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      } else {
        const formattedTransactions = (data || []).map(transactionService.formatTransaction);
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (category: string, amount: number, type: "income" | "expense") => {
    const result = await addTransaction(category, amount, type);
    if (result) {
      const newTransaction = transactionService.formatTransaction(result);
      setTransactions([newTransaction, ...transactions]);
      return true;
    }
    return false;
  };

  const handleEditTransaction = async (id: string, updates: Partial<FormattedTransaction>) => {
    const success = await editTransaction(id, updates);
    if (success) {
      setTransactions(prevTransactions => 
        prevTransactions.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      );
    }
    return success;
  };

  const handleDeleteTransaction = async (id: string) => {
    const success = await removeTransaction(id);
    if (success) {
      setTransactions(prevTransactions => 
        prevTransactions.filter(t => t.id !== id)
      );
    }
    return success;
  };

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    loading,
    filter,
    addTransaction: handleAddTransaction,
    editTransaction: handleEditTransaction,
    removeTransaction: handleDeleteTransaction,
    setFilter: handleFilterChange,
    resetFilters: handleResetFilters,
    loadTransactions
  };
};
