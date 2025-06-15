
import { useMemo } from "react";
import { useTransactions } from "./useTransactions";

export const useFinancialSummary = () => {
  const { transactions, loading } = useTransactions();

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netIncome = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      transactionCount: transactions.length
    };
  }, [transactions]);

  return {
    ...summary,
    loading,
    transactions
  };
};
