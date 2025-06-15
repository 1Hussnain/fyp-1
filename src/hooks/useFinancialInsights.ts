
/**
 * Financial Insights Hook
 * 
 * Provides advanced financial analytics and insights with:
 * - Monthly income and expense calculations
 * - Savings analysis (income minus expenses)
 * - Top spending categories identification
 * - Current month filtering for relevant data
 * - Real-time updates through transaction integration
 * 
 * This hook focuses on current month analytics to provide
 * actionable insights for budget management and spending patterns.
 * 
 * Key metrics calculated:
 * - Monthly income for current month
 * - Monthly expenses for current month
 * - Monthly savings (positive/negative)
 * - Top 3 spending categories with amounts
 * - Transaction count for the current month
 */

import { useMemo } from "react";
import { useTransactions } from "./useTransactions";

/**
 * Interface defining financial insights data structure
 * Focuses on monthly analytics and spending patterns
 */
interface FinancialInsights {
  monthlyIncome: number;                          // Current month income total
  monthlyExpenses: number;                        // Current month expenses total
  monthlySavings: number;                         // Monthly income minus expenses
  topSpendingCategories: [string, number][];      // Top 3 categories with amounts
  transactionCount: number;                       // Current month transaction count
  loading: boolean;                               // Loading state from transactions
  error: string | null;                           // Error state from transactions
}

/**
 * Main financial insights hook providing monthly analytics
 * @returns FinancialInsights object with current month metrics
 */
export const useFinancialInsights = (): FinancialInsights => {
  // Get real-time transaction data with loading and error states
  const { transactions, loading, error } = useTransactions();

  /**
   * Memoized calculation of financial insights for current month
   * Recalculates only when transactions array changes
   * Filters transactions to current month for relevant insights
   */
  const insights = useMemo(() => {
    console.log('[useFinancialInsights] Calculating insights for current month');

    // Get current date components for filtering
    const currentMonth = new Date().getMonth();     // 0-11 (January = 0)
    const currentYear = new Date().getFullYear();   // 4-digit year

    /**
     * Filter transactions to current month only
     * Uses transaction date field for accurate filtering
     */
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    console.log('[useFinancialInsights] Found', currentMonthTransactions.length, 'transactions for current month');

    /**
     * Calculate monthly income from current month transactions
     * Sums all income-type transactions for the current month
     */
    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    /**
     * Calculate monthly expenses from current month transactions
     * Sums all expense-type transactions for the current month
     */
    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    /**
     * Analyze spending categories to identify top spending areas
     * Groups expenses by category and sorts by amount
     */
    const topCategories = Object.entries(
      currentMonthTransactions
        .filter(t => t.type === "expense") // Only include expense transactions
        .reduce((acc, t) => {
          // Use category name or fallback to 'Uncategorized'
          const category = t.categories?.name || 'Uncategorized';
          // Accumulate spending by category
          acc[category] = (acc[category] || 0) + Number(t.amount);
          return acc;
        }, {} as Record<string, number>)
    )
    .sort(([,a], [,b]) => b - a) // Sort by amount (highest first)
    .slice(0, 3) as [string, number][]; // Take top 3 categories

    const calculatedInsights = {
      monthlyIncome,
      monthlyExpenses,
      monthlySavings: monthlyIncome - monthlyExpenses, // Positive = saving, negative = overspending
      topSpendingCategories: topCategories,
      transactionCount: currentMonthTransactions.length
    };

    console.log('[useFinancialInsights] Insights calculated:', calculatedInsights);

    return calculatedInsights;
  }, [transactions]); // Recalculate when transactions change

  // Return insights with state information from transactions hook
  return {
    ...insights,
    loading,
    error
  };
};
