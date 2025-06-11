
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction,
  deleteTransaction,
  Transaction 
} from "@/services/financialDatabase";

interface TransactionFilter {
  type: "all" | "income" | "expense";
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface FormattedTransaction {
  id: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
}

export const useTransactions = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<FormattedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TransactionFilter>({
    type: "all",
    startDate: undefined,
    endDate: undefined
  });

  // Load transactions from database
  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await getTransactions();
      if (error) {
        console.error('Error loading transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      } else {
        const formattedTransactions = (data || []).map((t: Transaction) => ({
          id: t.id,
          category: t.category,
          amount: parseFloat(t.amount.toString()),
          type: t.type as "income" | "expense",
          date: new Date(t.date).toLocaleDateString()
        }));
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (category: string, amount: number, type: "income" | "expense") => {
    if (!category.trim()) {
      toast({
        title: "Error",
        description: "Category cannot be empty",
        variant: "destructive",
      });
      return false;
    }
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be a positive number",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await createTransaction({
        type,
        category: category.trim(),
        source: type === "income" ? category.trim() : null,
        amount,
        description: null,
        date: new Date().toISOString()
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add transaction",
          variant: "destructive",
        });
        return false;
      }

      const newTransaction: FormattedTransaction = {
        id: data.id,
        category: category.trim(),
        amount,
        type,
        date: new Date().toLocaleDateString(),
      };

      setTransactions([newTransaction, ...transactions]);
      toast({
        title: "Success",
        description: `${type === "income" ? "Income" : "Expense"} added successfully`,
      });
      return true;
    } catch (err) {
      console.error("Error adding transaction:", err);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
      return false;
    }
  };

  const editTransaction = async (id: string, updates: Partial<FormattedTransaction>) => {
    try {
      const { error } = await updateTransaction(id, {
        category: updates.category,
        amount: updates.amount,
        type: updates.type,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update transaction",
          variant: "destructive",
        });
        return false;
      }

      setTransactions(prevTransactions => 
        prevTransactions.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      );

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
      return true;
    } catch (err) {
      console.error("Error updating transaction:", err);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeTransaction = async (id: string) => {
    try {
      const { error } = await deleteTransaction(id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete transaction",
          variant: "destructive",
        });
        return false;
      }

      setTransactions(prevTransactions => 
        prevTransactions.filter(t => t.id !== id)
      );

      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      return true;
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
      return false;
    }
  };

  // Apply filters to transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Filter by type
      if (filter.type !== "all" && transaction.type !== filter.type) {
        return false;
      }

      // Filter by date range
      if (filter.startDate || filter.endDate) {
        const transactionDate = new Date(transaction.date);
        
        if (filter.startDate && transactionDate < filter.startDate) {
          return false;
        }
        
        if (filter.endDate) {
          const endOfDay = new Date(filter.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (transactionDate > endOfDay) {
            return false;
          }
        }
      }
      
      return true;
    });
  }, [transactions, filter]);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    loading,
    filter,
    addTransaction,
    editTransaction,
    removeTransaction,
    setFilter,
    loadTransactions
  };
};
