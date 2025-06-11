
import { useMemo } from "react";
import { useTransactions } from "./useTransactions";

export const useFinancialSummary = () => {
  const { allTransactions } = useTransactions();

  const summary = useMemo(() => {
    const income = allTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = allTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = income - expenses;

    // Category breakdown for expenses
    const categoryTotals: Record<string, number> = {};
    allTransactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
      }
    });

    const categoryTotalsArray = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    return {
      income,
      expenses,
      savings,
      categoryTotalsArray
    };
  }, [allTransactions]);

  return summary;
};
