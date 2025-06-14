
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { optimizedFinancialService, TransactionWithCategory } from '@/services/optimizedFinancialService';
import { useToast } from '@/hooks/use-toast';

export const useOptimizedFinancial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsResult, categoriesResult] = await Promise.all([
        optimizedFinancialService.getTransactions(),
        optimizedFinancialService.getCategories()
      ]);

      if (transactionsResult.error) {
        console.error('Error loading transactions:', transactionsResult.error);
      } else {
        setTransactions(transactionsResult.data as TransactionWithCategory[]);
      }

      if (categoriesResult.error) {
        console.error('Error loading categories:', categoriesResult.error);
      } else {
        setCategories(categoriesResult.data);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: any) => {
    try {
      const result = await optimizedFinancialService.createTransaction({
        ...transactionData,
        user_id: user?.id
      });

      if (result.error) throw result.error;

      if (result.data) {
        setTransactions(prev => [result.data as TransactionWithCategory, ...prev]);
        toast({
          title: "Transaction Added",
          description: "Transaction added successfully",
        });
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateTransaction = async (id: string, updates: any) => {
    try {
      const result = await optimizedFinancialService.updateTransaction(id, updates);

      if (result.error) throw result.error;

      if (result.data) {
        setTransactions(prev => 
          prev.map(t => t.id === id ? result.data as TransactionWithCategory : t)
        );
        toast({
          title: "Transaction Updated",
          description: "Transaction updated successfully",
        });
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const result = await optimizedFinancialService.deleteTransaction(id);

      if (result.error) throw result.error;

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Transaction Deleted",
        description: "Transaction deleted successfully",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return {
    transactions,
    categories,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: loadData
  };
};
