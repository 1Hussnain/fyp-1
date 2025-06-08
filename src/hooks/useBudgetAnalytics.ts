
import { useState, useEffect, useMemo } from "react";
import { useFinancialDataDB } from "./useFinancialDataDB";
import { useGoalsDB } from "./useGoalsDB";

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  savings: number;
}

interface CategorySpending {
  name: string;
  amount: number;
  fill: string;
  percentage: number;
}

interface SpendingInsight {
  type: "warning" | "info" | "success";
  message: string;
  icon: string;
}

export const useBudgetAnalytics = () => {
  const { allTransactions, income, expenses, budgetLimit } = useFinancialDataDB();
  const { goals } = useGoalsDB();
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  // Generate monthly trend data from transactions
  const monthlyTrend = useMemo(() => {
    const monthlyData: Record<string, { income: number, expense: number }> = {};
    
    allTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === "income") {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' });
        return {
          month: monthName,
          income: data.income,
          expense: data.expense,
          savings: data.income - data.expense
        };
      });
  }, [allTransactions]);

  // Calculate category spending with colors and percentages
  const categorySpending = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];
    
    allTransactions
      .filter(t => t.type === "expense")
      .forEach(transaction => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(categoryTotals)
      .map(([name, amount], index) => ({
        name,
        amount,
        fill: colors[index % colors.length],
        percentage: expenses > 0 ? Math.round((amount / expenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [allTransactions, expenses]);

  // Generate spending insights
  const spendingInsights = useMemo(() => {
    const insights: SpendingInsight[] = [];
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;

    // Budget analysis
    if (expenses > budgetLimit) {
      insights.push({
        type: "warning",
        message: `You've exceeded your budget by $${(expenses - budgetLimit).toFixed(2)}. Consider reducing discretionary spending.`,
        icon: "⚠️"
      });
    } else if (expenses > budgetLimit * 0.9) {
      insights.push({
        type: "warning",
        message: `You're close to your budget limit. ${Math.round(((budgetLimit - expenses) / budgetLimit) * 100)}% remaining.`,
        icon: "🔔"
      });
    } else {
      insights.push({
        type: "success",
        message: `Great job! You're ${Math.round(((budgetLimit - expenses) / budgetLimit) * 100)}% under budget this month.`,
        icon: "✅"
      });
    }

    // Savings rate analysis
    if (savingsRate < 10) {
      insights.push({
        type: "warning",
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% to build financial security.`,
        icon: "💰"
      });
    } else if (savingsRate >= 20) {
      insights.push({
        type: "success",
        message: `Excellent! Your savings rate of ${savingsRate.toFixed(1)}% is above the recommended 20%.`,
        icon: "🎯"
      });
    } else {
      insights.push({
        type: "info",
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Try to reach 20% for optimal financial health.`,
        icon: "📈"
      });
    }

    // Category analysis
    const topCategory = categorySpending[0];
    if (topCategory && topCategory.percentage > 40) {
      insights.push({
        type: "warning",
        message: `${topCategory.name} represents ${topCategory.percentage}% of your spending. Consider diversifying your expenses.`,
        icon: "📊"
      });
    }

    // Goals progress
    const activeGoals = goals.filter(goal => (goal.saved / goal.target) * 100 < 100);
    if (activeGoals.length > 0) {
      const avgProgress = activeGoals.reduce((sum, goal) => sum + (goal.saved / goal.target) * 100, 0) / activeGoals.length;
      if (avgProgress < 25) {
        insights.push({
          type: "info",
          message: `Your average goal progress is ${avgProgress.toFixed(1)}%. Consider increasing your savings contributions.`,
          icon: "🎯"
        });
      }
    }

    return insights;
  }, [income, expenses, budgetLimit, categorySpending, goals]);

  // Calculate comparative metrics
  const comparativeMetrics = useMemo(() => {
    if (monthlyTrend.length < 2) return null;

    const currentMonth = monthlyTrend[monthlyTrend.length - 1];
    const previousMonth = monthlyTrend[monthlyTrend.length - 2];

    return {
      incomeChange: ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100,
      expenseChange: ((currentMonth.expense - previousMonth.expense) / previousMonth.expense) * 100,
      savingsChange: currentMonth.savings - previousMonth.savings
    };
  }, [monthlyTrend]);

  return {
    monthlyTrend,
    categorySpending,
    spendingInsights,
    comparativeMetrics,
    selectedPeriod,
    setSelectedPeriod,
    totalSavings: income - expenses,
    savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    budgetUtilization: budgetLimit > 0 ? (expenses / budgetLimit) * 100 : 0
  };
};
