
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { optimizedFinancialService, TransactionWithCategory } from "@/services/optimizedFinancialService";
import { useTransactionOperations } from "./useTransactionOperations";
import { useTransactionFilters } from "./useTransactionFilters";
import { useToast } from "@/hooks/use-toast";

// Updated FormattedTransaction to match new schema
export interface FormattedTransaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  description?: string;
  category_id?: string;
}

export const useTransactions = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const { addTransaction, editTransaction, deleteTransaction } = useTransactionOperations();
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
      const { data, error } = await optimizedFinancialService.getTransactions();
      if (error) {
        console.error('Error loading transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      } else {
        const formattedTransactions = (data || []).map(formatTransaction);
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTransaction = (transaction: TransactionWithCategory): FormattedTransaction => {
    return {
      id: transaction.id,
      category: transaction.category?.name || 'Uncategorized',
      amount: Number(transaction.amount),
      type: transaction.type as "income" | "expense",
      date: new Date(transaction.date).toLocaleDateString(),
      description: transaction.description || undefined,
      category_id: transaction.category_id || undefined
    };
  };

  const handleAddTransaction = async (category: string, amount: number, type: "income" | "expense") => {
    // First find or create the category
    const { data: categories } = await optimizedFinancialService.getCategories(type);
    let categoryId = categories.find(c => c.name === category)?.id;
    
    if (!categoryId) {
      // Create new category if it doesn't exist
      const { data: newCategory } = await optimizedFinancialService.createCategory({
        name: category,
        type,
        color: '#3B82F6',
        icon: 'DollarSign',
        user_id: user!.id,
        is_system: false
      });
      categoryId = newCategory?.id;
    }

    if (!categoryId) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
      return false;
    }

    const { data: result, error } = await optimizedFinancialService.createTransaction({
      type,
      category_id: categoryId,
      amount: amount,
      description: null,
      date: new Date().toISOString().split('T')[0],
      user_id: user!.id
    });

    if (result && !error) {
      const newTransaction = formatTransaction(result);
      setTransactions([newTransaction, ...transactions]);
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
      return false;
    }
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
    const success = await deleteTransaction(id);
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
