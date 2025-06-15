
/**
 * Optimized Financial Summary Hook
 * 
 * Provides financial calculations with:
 * - Memoized calculations for performance
 * - Error handling and fallbacks
 * - Type safety
 */

import { useMemo } from "react";
import { useTransactions } from "./useTransactions";

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  loading: boolean;
  error: string | null;
}

export const useFinancialSummary = (): FinancialSummary => {
  const { transactions, loading, error } = useTransactions();

  const summary = useMemo(() => {
    try {
      if (!Array.isArray(transactions)) {
        return {
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          transactionCount: 0
        };
      }

      const totalIncome = transactions
        .filter(t => t && t.type === "income")
        .reduce((sum, t) => {
          const amount = Number(t.amount);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

      const totalExpenses = transactions
        .filter(t => t && t.type === "expense")
        .reduce((sum, t) => {
          const amount = Number(t.amount);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

      const netIncome = totalIncome - totalExpenses;

      return {
        totalIncome,
        totalExpenses,
        netIncome,
        transactionCount: transactions.length
      };
    } catch (err) {
      console.error('Error calculating financial summary:', err);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0,
        transactionCount: 0
      };
    }
  }, [transactions]);

  return {
    ...summary,
    loading,
    error,
    transactions
  };
};
