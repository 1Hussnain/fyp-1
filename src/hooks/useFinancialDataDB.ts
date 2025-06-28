
import { useTransactions } from "./useTransactions";
import { useCategories } from "./useCategories";
import { useBulkOperations } from "./useBulkOperations";
import { useBudget } from "./useBudget";
import { useMemo, useState, useCallback } from "react";

export const useFinancialDataDB = () => {
  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch
  } = useTransactions();

  const { categories } = useCategories();
  const { handleBulkImport: bulkImport, handleAddRecurring: addRecurring } = useBulkOperations();
  const { budgetLimit, updateBudgetLimit, currentSpent } = useBudget();

  // Filter state
  const [filter, setFilter] = useState({
    type: 'all' as 'all' | 'income' | 'expense',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    category: 'all' as string,
    searchTerm: '' as string
  });

  // Apply filters to transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Type filter
      if (filter.type !== 'all' && transaction.type !== filter.type) {
        return false;
      }

      // Date range filter
      if (filter.startDate && new Date(transaction.date) < filter.startDate) {
        return false;
      }
      if (filter.endDate && new Date(transaction.date) > filter.endDate) {
        return false;
      }

      // Category filter
      if (filter.category !== 'all' && transaction.category_id !== filter.category) {
        return false;
      }

      // Search term filter
      if (filter.searchTerm && !transaction.description?.toLowerCase().includes(filter.searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [transactions, filter]);

  // Calculate financial summary with memoization for performance
  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Calculate category totals for breakdown
    const categoryTotals: Record<string, number> = {};
    filteredTransactions
      .filter(t => t.type === "expense")
      .forEach(transaction => {
        const categoryName = transaction.categories?.name || 'Uncategorized';
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Number(transaction.amount);
      });

    const categoryTotalsArray = Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount
    }));

    return {
      income,
      expenses,
      remaining: income - expenses,
      categoryTotalsArray
    };
  }, [filteredTransactions]);

  // Optimized handlers with useCallback for performance
  const handleAddTransaction = useCallback(async (data: any) => {
    return await addTransaction(data);
  }, [addTransaction]);

  const handleEditTransaction = useCallback(async (id: string, updates: any) => {
    return await updateTransaction(id, updates);
  }, [updateTransaction]);

  const handleDeleteTransaction = useCallback(async (id: string) => {
    return await deleteTransaction(id);
  }, [deleteTransaction]);

  const handleBulkImport = useCallback(async (importedData: any[]) => {
    try {
      const result = await bulkImport(importedData);
      if (result.success) {
        await refetch(); // Refresh data after bulk import
      }
      return result;
    } catch (error) {
      console.error('Bulk import failed:', error);
      return { success: false, error: 'Bulk import failed' };
    }
  }, [bulkImport, refetch]);

  const handleAddRecurring = useCallback(async (recurringData: any, frequency: string, count: number) => {
    try {
      const result = await addRecurring(recurringData, frequency as any, count);
      if (result.success) {
        await refetch(); // Refresh data after adding recurring
      }
      return result;
    } catch (error) {
      console.error('Add recurring failed:', error);
      return { success: false, error: 'Add recurring failed' };
    }
  }, [addRecurring, refetch]);

  const handleFilterChange = useCallback((newFilter: Partial<typeof filter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilter({
      type: 'all',
      startDate: undefined,
      endDate: undefined,
      category: 'all',
      searchTerm: ''
    });
  }, []);

  const handleBudgetLimitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseFloat(e.target.value) || 0;
    updateBudgetLimit(newLimit);
  }, [updateBudgetLimit]);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    income: summary.income,
    expenses: summary.expenses,
    budgetLimit,
    remaining: summary.remaining,
    overBudget: summary.expenses > budgetLimit && budgetLimit > 0,
    closeToLimit: summary.expenses > budgetLimit * 0.8 && budgetLimit > 0,
    loading: transactionsLoading,
    error: null,
    categoryTotalsArray: summary.categoryTotalsArray,
    filter,
    handleBudgetLimitChange,
    handleAddTransaction,
    handleEditTransaction,
    handleDeleteTransaction,
    handleBulkImport,
    handleAddRecurring,
    handleFilterChange,
    handleResetFilters,
    loadFinancialData: refetch
  };
};
