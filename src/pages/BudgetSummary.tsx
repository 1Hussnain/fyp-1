
/**
 * Budget Summary Page Component
 * 
 * Comprehensive budget overview with:
 * - Error boundary integration
 * - Loading states and error handling
 * - Responsive charts and visualizations
 * - Performance optimizations
 */

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useFinancialInsights } from "@/hooks/useFinancialInsights";
import { useGoals } from "@/hooks/useGoals";
import { TrendingUp, TrendingDown, Target, DollarSign, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for the budget summary page
 */
const BudgetSummaryLoading: React.FC = () => (
  <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
    <Skeleton className="h-8 w-64 mb-6" />
    
    {/* Summary cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Charts skeleton */}
    <div className="grid lg:grid-cols-2 gap-8">
      {[...Array(2)].map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

/**
 * Error component for budget summary
 */
const BudgetSummaryError: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <div className="max-w-6xl mx-auto px-6 py-8">
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to load budget summary: {error}</span>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="ml-4 underline hover:no-underline"
          >
            Try Again
          </button>
        )}
      </AlertDescription>
    </Alert>
  </div>
);

/**
 * Main budget summary component
 */
const BudgetSummary: React.FC = () => {
  const { 
    totalIncome, 
    totalExpenses, 
    netIncome, 
    loading: summaryLoading, 
    error: summaryError 
  } = useFinancialSummary();
  
  const { 
    monthlyIncome, 
    monthlyExpenses, 
    topSpendingCategories,
    loading: insightsLoading,
    error: insightsError
  } = useFinancialInsights();
  
  const { goals, loading: goalsLoading, error: goalsError } = useGoals();

  const loading = summaryLoading || insightsLoading || goalsLoading;
  const error = summaryError || insightsError || goalsError;

  // Handle error state
  if (error) {
    return <BudgetSummaryError error={error} />;
  }

  // Handle loading state
  if (loading) {
    return <BudgetSummaryLoading />;
  }

  // Prepare summary cards data with safe defaults
  const summaryCards = [
    {
      title: "Monthly Income",
      value: `$${(monthlyIncome || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Monthly Expenses",
      value: `$${(monthlyExpenses || 0).toFixed(2)}`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Net Savings",
      value: `$${((monthlyIncome || 0) - (monthlyExpenses || 0)).toFixed(2)}`,
      icon: DollarSign,
      color: (monthlyIncome || 0) - (monthlyExpenses || 0) >= 0 ? "text-green-600" : "text-red-600",
      bgColor: (monthlyIncome || 0) - (monthlyExpenses || 0) >= 0 ? "bg-green-50" : "bg-red-50"
    },
    {
      title: "Active Goals",
      value: (goals?.filter(g => !g.is_completed)?.length || 0).toString(),
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  // Prepare chart data with fallbacks
  const chartData = (topSpendingCategories || []).map(([name, amount]) => ({
    name: name || 'Unknown',
    value: Number(amount) || 0
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  // Calculate savings rate safely
  const savingsRate = monthlyIncome && monthlyIncome > 0 
    ? (((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Budget Summary</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Spending Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No spending data available</p>
                  <p className="text-sm mt-2">Add some expense transactions to see your spending breakdown</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Income vs Expenses</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Income</span>
                    <span className="font-medium text-green-600">${(monthlyIncome || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expenses</span>
                    <span className="font-medium text-red-600">${(monthlyExpenses || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Net</span>
                    <span className={`font-bold ${
                      (monthlyIncome || 0) - (monthlyExpenses || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${((monthlyIncome || 0) - (monthlyExpenses || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {monthlyIncome && monthlyIncome > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">Savings Rate</div>
                    <div className="text-lg font-bold text-blue-600">
                      {savingsRate.toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetSummary;
