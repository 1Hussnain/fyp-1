
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "./useTransactions";
import { useBudget } from "./useBudget";
import { useFinancialCalculations } from "./useFinancialCalculations";

export const useFinancialDataOrchestrator = () => {
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

  // Update budget spent when expenses change
  useEffect(() => {
    if (user && !budgetLoading) {
      updateSpent(expenses);
    }
  }, [expenses, user, budgetLoading, updateSpent]);

  const budgetStatus = getBudgetStatus(budgetLimit);

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
    categoryTotalsArray,
    filter,
    addTransaction,
    editTransaction,
    removeTransaction,
    updateBudgetLimit,
    setFilter,
    resetFilters
  };
};
