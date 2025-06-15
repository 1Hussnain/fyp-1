
import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { CategorySpending } from "@/types/database";

export const useFinancialCalculations = () => {
  const { transactions } = useTransactions();

  const calculations = useMemo(() => {
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const categoryTotals: Record<string, number> = {};
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

    transactions
      .filter(t => t.type === "expense")
      .forEach(transaction => {
        const categoryName = transaction.categories?.name || 'Uncategorized';
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Number(transaction.amount);
      });

    const categorySpending: CategorySpending[] = Object.entries(categoryTotals)
      .map(([name, amount], index) => ({
        name,
        amount,
        fill: colors[index % colors.length],
        percentage: expenses > 0 ? Math.round((amount / expenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      income,
      expenses,
      netIncome: income - expenses,
      categorySpending,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0
    };
  }, [transactions]);

  return calculations;
};
