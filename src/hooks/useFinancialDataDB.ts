
import { useFinancialDataOrchestrator } from "./useFinancialDataOrchestrator";
import { useFinancialActions } from "./useFinancialActions";

export const useFinancialDataDB = () => {
  const {
    transactions,
    allTransactions,
    income,
    expenses,
    budgetLimit,
    remaining,
    overBudget,
    closeToLimit,
    loading,
    categoryTotalsArray,
    filter
  } = useFinancialDataOrchestrator();

  const {
    handleAddTransaction,
    handleEditTransaction,
    handleDeleteTransaction,
    handleBudgetLimitChange,
    handleBulkImport,
    handleAddRecurring,
    handleFilterChange,
    handleResetFilters
  } = useFinancialActions();

  return {
    transactions,
    allTransactions,
    income,
    expenses,
    budgetLimit,
    remaining,
    overBudget,
    closeToLimit,
    loading,
    error: null,
    categoryTotalsArray,
    filter,
    handleBudgetLimitChange,
    handleAddTransaction,
    handleEditTransaction,
    handleDeleteTransaction,
    handleBulkImport,
    handleAddRecurring,
    handleFilterChange,
    handleResetFilters,
    loadFinancialData: () => {} // Deprecated, individual hooks handle loading
  };
};
