
import { useMemo } from "react";
import { FormattedTransaction } from "@/services/transactionService";

export const useFinancialCalculations = (transactions: FormattedTransaction[]) => {
  const calculations = useMemo(() => {
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = income - expenses;

    // Category breakdown for expenses
    const categoryTotals: Record<string, number> = {};
    transactions.forEach((transaction) => {
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
      remaining,
      categoryTotalsArray
    };
  }, [transactions]);

  const getBudgetStatus = (budgetLimit: number) => {
    const overBudget = calculations.expenses > budgetLimit;
    const closeToLimit = calculations.expenses > budgetLimit * 0.9 && !overBudget;
    
    return {
      overBudget,
      closeToLimit,
      remaining: budgetLimit - calculations.expenses,
      percentUsed: (calculations.expenses / budgetLimit) * 100
    };
  };

  return {
    ...calculations,
    getBudgetStatus
  };
};
