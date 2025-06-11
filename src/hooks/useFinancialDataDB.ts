
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "./useTransactions";
import { useBudget } from "./useBudget";
import { useFinancialCalculations } from "./useFinancialCalculations";
import { useBulkOperations } from "./useBulkOperations";

export const useFinancialDataDB = () => {
  const { user } = useAuth();
  const {
    transactions,
    allTransactions,
    loading: transactionsLoading,
    filter,
    addTransaction,
    editTransaction,
    removeTransaction,
    setFilter,
    resetFilters
  } = useTransactions();

  const {
    budgetLimit,
    currentSpent,
    loading: budgetLoading,
    updateBudgetLimit,
    updateSpent
  } = useBudget();

  const {
    income,
    expenses,
    remaining,
    categoryTotalsArray,
    getBudgetStatus
  } = useFinancialCalculations(allTransactions);

  const { handleBulkImport, handleAddRecurring } = useBulkOperations();

  // Update budget spent when expenses change
  useEffect(() => {
    if (user && !budgetLoading) {
      updateSpent(expenses);
    }
  }, [expenses, user, budgetLoading]);

  const budgetStatus = getBudgetStatus(budgetLimit);

  const handleBudgetLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    updateBudgetLimit(value);
  };

  const handleFilterChange = (newFilter: any) => {
    setFilter(newFilter);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  return {
    transactions,
    allTransactions,
    income,
    expenses,
    budgetLimit,
    remaining,
    overBudget: budgetStatus.overBudget,
    closeToLimit: budgetStatus.closeToLimit,
    loading: transactionsLoading || budgetLoading,
    error: null,
    categoryTotalsArray,
    filter,
    handleBudgetLimitChange,
    handleAddTransaction: addTransaction,
    handleEditTransaction: editTransaction,
    handleDeleteTransaction: removeTransaction,
    handleBulkImport,
    handleAddRecurring,
    handleFilterChange,
    handleResetFilters,
    loadFinancialData: () => {} // Deprecated, individual hooks handle loading
  };
};
