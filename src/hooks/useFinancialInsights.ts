
import { useMemo } from "react";
import { useTransactions } from "./useTransactions";

export const useFinancialInsights = () => {
  const { transactions } = useTransactions();

  const insights = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const topCategories = Object.entries(
      currentMonthTransactions
        .filter(t => t.type === "expense")
        .reduce((acc, t) => {
          const category = t.categories?.name || 'Uncategorized';
          acc[category] = (acc[category] || 0) + Number(t.amount);
          return acc;
        }, {} as Record<string, number>)
    )
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

    return {
      monthlyIncome,
      monthlyExpenses,
      monthlySavings: monthlyIncome - monthlyExpenses,
      topSpendingCategories: topCategories,
      transactionCount: currentMonthTransactions.length
    };
  }, [transactions]);

  return insights;
};
