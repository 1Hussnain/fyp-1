
import { useMemo } from "react";
import { FormattedTransaction } from "@/services/transactionService";

export interface FinancialInsight {
  type: 'spending_pattern' | 'category_trend' | 'budget_efficiency' | 'savings_rate';
  title: string;
  description: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  recommendation?: string;
}

export const useFinancialInsights = (transactions: FormattedTransaction[], budgetLimit: number) => {
  const insights = useMemo((): FinancialInsight[] => {
    if (transactions.length === 0) return [];

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filter current month transactions
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const insights: FinancialInsight[] = [];

    // Savings Rate Insight
    if (totalIncome > 0) {
      const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
      insights.push({
        type: 'savings_rate',
        title: 'Savings Rate',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income this month`,
        value: savingsRate,
        trend: savingsRate >= 20 ? 'up' : savingsRate >= 10 ? 'stable' : 'down',
        recommendation: savingsRate < 20 ? 'Try to save at least 20% of your income for better financial health' : undefined
      });
    }

    // Budget Efficiency
    if (budgetLimit > 0) {
      const budgetUsage = (totalExpenses / budgetLimit) * 100;
      insights.push({
        type: 'budget_efficiency',
        title: 'Budget Usage',
        description: `You've used ${budgetUsage.toFixed(1)}% of your monthly budget`,
        value: budgetUsage,
        trend: budgetUsage > 90 ? 'up' : budgetUsage < 70 ? 'down' : 'stable',
        recommendation: budgetUsage > 90 ? 'Consider reducing discretionary spending' : undefined
      });
    }

    // Top Spending Category
    const categoryTotals: Record<string, number> = {};
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];

    if (topCategory) {
      const [category, amount] = topCategory;
      const percentage = (amount / totalExpenses) * 100;
      insights.push({
        type: 'spending_pattern',
        title: 'Top Spending Category',
        description: `${category} accounts for ${percentage.toFixed(1)}% of your expenses`,
        value: percentage,
        trend: percentage > 40 ? 'up' : 'stable',
        recommendation: percentage > 40 ? `Consider reviewing your ${category} expenses` : undefined
      });
    }

    // Weekly Spending Trend
    const weeklySpending = calculateWeeklyTrend(currentMonthTransactions);
    if (weeklySpending.length >= 2) {
      const lastWeek = weeklySpending[weeklySpending.length - 1];
      const previousWeek = weeklySpending[weeklySpending.length - 2];
      const change = ((lastWeek - previousWeek) / previousWeek) * 100;
      
      insights.push({
        type: 'category_trend',
        title: 'Weekly Spending Trend',
        description: `Your spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% this week`,
        value: change,
        trend: change > 10 ? 'up' : change < -10 ? 'down' : 'stable',
        recommendation: change > 20 ? 'Monitor your spending closely this week' : undefined
      });
    }

    return insights;
  }, [transactions, budgetLimit]);

  const calculateWeeklyTrend = (transactions: FormattedTransaction[]): number[] => {
    const weeks: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const date = new Date(t.date);
        const weekKey = getWeekKey(date);
        weeks[weekKey] = (weeks[weekKey] || 0) + t.amount;
      });

    return Object.values(weeks);
  };

  const getWeekKey = (date: Date): string => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    return weekStart.toISOString().split('T')[0];
  };

  return { insights };
};
