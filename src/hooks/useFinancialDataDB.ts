import { useTransactions } from "./useTransactions";
import { useCategories } from "./useCategories";
import { useMemo } from "react";

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

  // Calculate financial summary
  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expenses,
      remaining: income - expenses,
      categoryTotalsArray: []
    };
  }, [transactions]);

  // Simple handlers for compatibility
  const handleAddTransaction = async (data: any) => {
    return await addTransaction(data);
  };

  const handleEditTransaction = async (id: string, updates: any) => {
    return await updateTransaction(id, updates);
  };

  const handleDeleteTransaction = async (id: string) => {
    return await deleteTransaction(id);
  };

  const handleBulkImport = async (importedData: any[]) => {
    // Implement bulk import logic
    console.log('Bulk import:', importedData);
  };

  const handleAddRecurring = async (recurringData: any, frequency: string, count: number) => {
    // Implement recurring transaction logic
    console.log('Add recurring:', recurringData, frequency, count);
  };

  const handleFilterChange = (filter: any) => {
    // Implement filter logic
    console.log('Filter change:', filter);
  };

  const handleResetFilters = () => {
    // Implement reset filters logic
    console.log('Reset filters');
  };

  const handleBudgetLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Implement budget limit change logic
    console.log('Budget limit change:', e.target.value);
  };

  const filter = {
    type: 'all' as 'all' | 'income' | 'expense',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  };

  return {
    transactions,
    allTransactions: transactions,
    income: summary.income,
    expenses: summary.expenses,
    budgetLimit: 5000, // Default budget limit
    remaining: summary.remaining,
    overBudget: summary.expenses > 5000,
    closeToLimit: summary.expenses > 4500,
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
