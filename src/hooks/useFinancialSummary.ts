
/**
 * Optimized Financial Summary Hook
 * 
 * Provides comprehensive financial calculations and metrics with:
 * - Memoized calculations for optimal performance
 * - Error handling and fallbacks for data integrity
 * - Type safety with proper TypeScript interfaces
 * - Real-time updates through transaction hook integration
 * 
 * This hook calculates key financial metrics including:
 * - Total income across all transactions
 * - Total expenses across all transactions  
 * - Net income (income minus expenses)
 * - Transaction count for analytics
 * 
 * Performance optimizations:
 * - useMemo for expensive calculations
 * - Safe number parsing with fallbacks
 * - Array validation to prevent runtime errors
 */

import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { TransactionWithCategory } from "@/types/database";

/**
 * Interface defining the structure of financial summary data
 * Includes both calculated metrics and metadata
 */
interface FinancialSummary {
  totalIncome: number;        // Sum of all income transactions
  totalExpenses: number;      // Sum of all expense transactions
  netIncome: number;          // Income minus expenses
  transactionCount: number;   // Total number of transactions
  transactions: TransactionWithCategory[]; // Raw transaction data
  loading: boolean;           // Loading state from transactions hook
  error: string | null;       // Error state from transactions hook
}

/**
 * Main financial summary hook
 * @returns FinancialSummary object with calculated metrics and state
 */
export const useFinancialSummary = (): FinancialSummary => {
  // Get transactions data with real-time updates and loading states
  const { transactions, loading, error } = useTransactions();

  /**
   * Memoized calculation of financial summary metrics
   * Recalculates only when transactions array changes
   * Includes comprehensive error handling and data validation
   */
  const summary = useMemo(() => {
    try {
      console.log('[useFinancialSummary] Calculating summary for', transactions?.length || 0, 'transactions');

      // Validate transactions array to prevent runtime errors
      if (!Array.isArray(transactions)) {
        console.warn('[useFinancialSummary] Transactions is not an array, returning defaults');
        return {
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          transactionCount: 0
        };
      }

      /**
       * Calculate total income from all income-type transactions
       * Includes safe number parsing and NaN handling
       */
      const totalIncome = transactions
        .filter(t => t && t.type === "income") // Filter for income transactions
        .reduce((sum, t) => {
          const amount = Number(t.amount);
          // Skip invalid amounts to prevent calculation errors
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

      /**
       * Calculate total expenses from all expense-type transactions
       * Uses same safe parsing approach as income calculation
       */
      const totalExpenses = transactions
        .filter(t => t && t.type === "expense") // Filter for expense transactions
        .reduce((sum, t) => {
          const amount = Number(t.amount);
          // Skip invalid amounts to prevent calculation errors
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

      // Calculate net income (positive = surplus, negative = deficit)
      const netIncome = totalIncome - totalExpenses;

      console.log('[useFinancialSummary] Summary calculated:', {
        totalIncome,
        totalExpenses,
        netIncome,
        transactionCount: transactions.length
      });

      return {
        totalIncome,
        totalExpenses,
        netIncome,
        transactionCount: transactions.length
      };
    } catch (err) {
      // Log errors for debugging but return safe defaults
      console.error('[useFinancialSummary] Error calculating financial summary:', err);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0,
        transactionCount: 0
      };
    }
  }, [transactions]); // Only recalculate when transactions change

  // Return complete summary with raw data and state information
  return {
    ...summary,
    transactions,
    loading,
    error
  };
};
